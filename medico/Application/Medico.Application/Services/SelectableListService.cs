using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableList;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class SelectableListService
        : BaseDeletableByIdService<SelectableList, SelectableListVm>, ISelectableListService
    {
        private readonly ICategorySelectableListViewRepository _selectableListViewRepository;
        private readonly ISelectableListCategoryService _selectableListCategoryService;
        private readonly IUnitOfWork _unitOfWork;

        public SelectableListService(ISelectableListRepository selectableListRepository,
            ICategorySelectableListViewRepository selectableListViewRepository,
            IMapper mapper,
            ISelectableListCategoryService selectableListCategoryService, IUnitOfWork unitOfWork)
            : base(selectableListRepository, mapper)
        {
            _selectableListViewRepository = selectableListViewRepository;
            _selectableListCategoryService = selectableListCategoryService;
            _unitOfWork = unitOfWork;
        }

        public override Task<SelectableListVm> Update(SelectableListVm viewModel)
        {
            if (viewModel.CompanyId == null)
                viewModel.Version++;

            return base.Update(viewModel);
        }

        public override Task<SelectableListVm> Create(SelectableListVm viewModel)
        {
            if (viewModel.CompanyId == null)
                viewModel.Version = 1;

            return base.Update(viewModel);
        }

        public IQueryable<CompanyCategorySelectableListVm> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<CompanyCategorySelectableListVm>()
                    .AsQueryable();

            return _selectableListViewRepository.GetAll().Where(l => l.CompanyId == companyId)
                .ProjectTo<CompanyCategorySelectableListVm>();
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>()
                    .AsQueryable();

            return Repository.GetAll().Where(l => l.CompanyId == companyId && l.IsActive)
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(l => l.CompanyId == null && l.IsActive)
                .ProjectTo<LookupViewModel>();
        }

        public async Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid newCompanyId,
            IDictionary<Guid, Guid> selectableListCategoriesMap)
        {
            var librarySelectableLists = await Repository
                .GetAll()
                .Where(sl => sl.IsActive && sl.CompanyId == null)
                .ToListAsync();

            var selectableListsMap = new Dictionary<Guid, Guid>();

            foreach (var librarySelectableList in librarySelectableLists)
            {
                var companySelectableListId = Guid.NewGuid();
                var librarySelectableListId = librarySelectableList.Id;

                selectableListsMap.Add(librarySelectableListId, companySelectableListId);

                var companySelectableList = new SelectableList
                {
                    Id = companySelectableListId,
                    LibrarySelectableListId = librarySelectableListId,
                    CompanyId = newCompanyId,
                    Title = librarySelectableList.Title,
                    Version = librarySelectableList.Version,
                    IsActive = librarySelectableList.IsActive,
                    JsonValues = librarySelectableList.JsonValues,
                    CategoryId = selectableListCategoriesMap[librarySelectableList.CategoryId],
                    IsPredefined = librarySelectableList.IsPredefined
                };

                Repository.Add(companySelectableList);
            }

            return selectableListsMap;
        }

        public async Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> librarySelectableListIds,
            Guid companyId, bool commitChanges = false)
        {
            var libraryWithAlreadyImportedSelectableLists = await Repository.GetAll()
                .Where(sl => sl.CompanyId == null && librarySelectableListIds.Contains(sl.Id) ||
                             sl.CompanyId == companyId && sl.LibrarySelectableListId != null
                                                       && librarySelectableListIds.Contains(sl.LibrarySelectableListId
                                                           .Value))
                .ToListAsync();

            var libraryImportedSelectableListMap =
                libraryWithAlreadyImportedSelectableLists
                    .Where(c => c.CompanyId == companyId && c.LibrarySelectableListId != null)
                    .Select(c => new
                        {LibrarySelectableListId = c.LibrarySelectableListId.Value, CompanySelectableListId = c.Id})
                    .ToDictionary(c => c.LibrarySelectableListId,
                        c => c.CompanySelectableListId);

            var librarySelectableLists =
                libraryWithAlreadyImportedSelectableLists
                    .Where(c => c.CompanyId == null)
                    .ToList();

            var libraryImportedSelectableListIds = libraryImportedSelectableListMap.Keys;

            var newLibrarySelectableListsToImport = librarySelectableLists
                .Where(c => !libraryImportedSelectableListIds.Contains(c.Id))
                .ToList();

            if (!newLibrarySelectableListsToImport.Any())
                return libraryImportedSelectableListMap;

            var libraryCategoryIds = librarySelectableLists
                .Select(sl => sl.CategoryId)
                .Distinct()
                .ToList();

            var libraryCategoriesMap = await _selectableListCategoryService
                .ImportFromLibrary(libraryCategoryIds, companyId);

            var newLibrarySelectableLists = new List<SelectableList>();

            foreach (var selectableList in newLibrarySelectableListsToImport)
            {
                var newSelectableListId = Guid.NewGuid();
                var newSelectableList = new SelectableList
                {
                    Id = newSelectableListId,
                    CompanyId = companyId,
                    LibrarySelectableListId = selectableList.Id,
                    Title = selectableList.Title,
                    Version = selectableList.Version,
                    JsonValues = selectableList.JsonValues,
                    CategoryId = libraryCategoriesMap[selectableList.CategoryId],
                    IsActive = true
                };

                libraryImportedSelectableListMap.Add(selectableList.Id, newSelectableListId);
                newLibrarySelectableLists.Add(newSelectableList);
            }

            Repository.AddRange(newLibrarySelectableLists);

            if (commitChanges)
                await _unitOfWork.Commit();

            return libraryImportedSelectableListMap;
        }

        public Task<List<SelectableListVm>> GetByFilter(SelectableListSearchFilterVm searchFilter)
        {
            var query = Repository.GetAll();

            var excludeImported = searchFilter.ExcludeImported;
            if (excludeImported.HasValue)
                return GetListsNotImportedToCompany(searchFilter.CategoryId, searchFilter.CompanyId);

            var selectableListTitle = searchFilter.Title;

            if (!string.IsNullOrEmpty(selectableListTitle))
                query = query.Where(l => l.Title == selectableListTitle);

            var companyId = searchFilter.CompanyId;
            query = query.Where(tt => tt.CompanyId == companyId);

            var categoryId = searchFilter.CategoryId;
            if (categoryId.HasValue)
                query = query.Where(l => l.CategoryId == categoryId);

            var librarySelectableListId = searchFilter.LibrarySelectableListId;
            if (librarySelectableListId != null)
                query = query.Where(l => l.LibrarySelectableListId != null
                                         && l.LibrarySelectableListId.Value == librarySelectableListId);

            var isActiveEntity = searchFilter.IsActive;
            if (isActiveEntity != null)
                query = query.Where(tt => tt.IsActive == isActiveEntity.Value);

            var librarySelectableListIdsStr = searchFilter.LibrarySelectableListIds;
            if (!string.IsNullOrEmpty(librarySelectableListIdsStr))
            {
                var librarySelectableListIds = librarySelectableListIdsStr
                    .Split(",")
                    .Select(Guid.Parse);

                query = query.Include(t => t.LibrarySelectableList)
                    .Where(l => librarySelectableListIds.Contains(l.LibrarySelectableList.Id));
            }

            if (searchFilter.Take != 0)
                query = query.Take(searchFilter.Take);

            return query
                .ProjectTo<SelectableListVm>()
                .ToListAsync();
        }

        private async Task<List<SelectableListVm>> GetListsNotImportedToCompany(Guid? categoryId, Guid? companyId)
        {
            if (categoryId == null || companyId == null)
                throw new ArgumentNullException();

            var libraryListQuery =
                Repository.GetAll()
                    .Where(l => l.CategoryId == categoryId.Value)
                    .ProjectTo<SelectableListVm>();

            var companyImportedListsIdsQuery = Repository.GetAll()
                .Where(l => l.CompanyId == companyId && l.LibrarySelectableListId.HasValue)
                .Select(t => t.LibrarySelectableListId.Value);

            var templateMaps = await libraryListQuery
                .GroupJoin(companyImportedListsIdsQuery,
                    libraryList => libraryList.Id,
                    companyImportedListId => companyImportedListId,
                    (libraryList, companyImportedListId) => new
                        {libraryList, companyImportedListId})
                .SelectMany(
                    map => map.companyImportedListId.DefaultIfEmpty(),
                    (map, companyImportedListId) => new {map.libraryList, companyImportedListId})
                .ToListAsync();

            return templateMaps.Where(map => map.companyImportedListId == Guid.Empty)
                .Select(x => x.libraryList)
                .ToList();
        }

        public async Task ActivateDeactivateSelectableList(Guid id, bool isActive)
        {
            var selectableList = await Repository.GetAll()
                .FirstOrDefaultAsync(tt => tt.Id == id);

            selectableList.IsActive = isActive;

            await Repository.SaveChangesAsync();
        }

        public IQueryable<CategorySelectableListVm> LibraryGrid(DxOptionsViewModel loadOptions)
        {
            return _selectableListViewRepository.GetAll().Where(l => l.CompanyId == null)
                .ProjectTo<CategorySelectableListVm>();
        }

        public async Task SyncWithLibraryList(Guid id)
        {
            var selectableList = await Repository.GetAll()
                .Include(t => t.LibrarySelectableList)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (selectableList == null)
                return;

            var libraryList = selectableList.LibrarySelectableList;

            if (libraryList == null)
                throw new ArgumentNullException(nameof(libraryList));

            selectableList.Version = libraryList.Version;
            selectableList.JsonValues = libraryList.JsonValues;

            await _unitOfWork.Commit();
        }

        public async Task Delete(Guid id)
        {
            var selectableList = await Repository
                .GetAll()
                .Include(l => l.LibraryRelatedSelectableLists)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (selectableList == null)
                return;

            if (selectableList.IsPredefined)
                throw new InvalidOperationException("Predefined selectable lists cannot be deleted");

            var libraryRelatedSelectableLists =
                selectableList.LibraryRelatedSelectableLists;

            if (libraryRelatedSelectableLists.Any())
            {
                foreach (var libraryRelatedSelectableList in libraryRelatedSelectableLists)
                {
                    libraryRelatedSelectableList.Version = null;
                    libraryRelatedSelectableList.LibrarySelectableListId = null;
                }
            }

            var selectableListRepository =
                (ISelectableListRepository) Repository;

            selectableListRepository.Remove(id);

            await _unitOfWork.Commit();
        }
    }
}