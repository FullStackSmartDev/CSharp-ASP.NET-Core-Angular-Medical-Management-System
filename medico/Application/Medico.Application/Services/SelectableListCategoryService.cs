using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableListCategory;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class SelectableListCategoryService
        : BaseDeletableByIdService<SelectableListCategory, SelectableListCategoryVm>,
            ISelectableListCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SelectableListCategoryService(
            ISelectableListCategoryRepository selectableListCategoryRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork) : base(selectableListCategoryRepository, mapper)
        {
            _unitOfWork = unitOfWork;
        }

        public IQueryable<SelectableListCategoryVm> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<SelectableListCategoryVm>();
        }

        public async Task Delete(Guid id)
        {
            var categoryToDelete = await Repository
                .GetAll()
                .Include(c => c.LibraryRelatedSelectableListCategories)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoryToDelete == null)
                return;

            var libraryRelatedCategories =
                categoryToDelete.LibraryRelatedSelectableListCategories;

            if (libraryRelatedCategories.Any())
            {
                foreach (var libraryRelatedCategory in libraryRelatedCategories)
                {
                    libraryRelatedCategory.Version = null;
                    libraryRelatedCategory.LibrarySelectableListCategoryId = null;
                }
            }

            var selectableListCategoryRepository =
                (ISelectableListCategoryRepository)Repository;

            selectableListCategoryRepository.Remove(id);

            await _unitOfWork.Commit();
        }

        public IQueryable<SelectableListCategoryVm> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<SelectableListCategoryVm>()
                    .AsQueryable();

            return Repository.GetAll().Where(c => c.CompanyId == companyId)
                .ProjectTo<SelectableListCategoryVm>();
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>()
                    .AsQueryable();

            return Repository.GetAll().Where(c => c.CompanyId == companyId && c.IsActive)
                .ProjectTo<LookupViewModel>();
        }

        public async Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid newCompanyId)
        {
            var libraryCategories = await Repository
                .GetAll()
                .Where(c => c.IsActive && c.CompanyId == null)
                .ToListAsync();

            var categoriesMap = new Dictionary<Guid, Guid>();

            foreach (var libraryCategory in libraryCategories)
            {
                var companyCategoryId = Guid.NewGuid();
                var libraryCategoryId = libraryCategory.Id;

                categoriesMap.Add(libraryCategoryId, companyCategoryId);

                var companyCategory = new SelectableListCategory
                {
                    Id = companyCategoryId,
                    LibrarySelectableListCategoryId = libraryCategoryId,
                    CompanyId = newCompanyId,
                    Title = libraryCategory.Title,
                    Version = libraryCategory.Version,
                    IsActive = libraryCategory.IsActive
                };

                Repository.Add(companyCategory);
            }

            return categoriesMap;
        }

        public async Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryCategoryIds,
            Guid companyId)
        {
            var libraryWithAlreadyImportedCategories = await Repository.GetAll()
                .Where(c => c.CompanyId == null && libraryCategoryIds.Contains(c.Id) ||
                            c.CompanyId == companyId && c.LibrarySelectableListCategoryId != null
                            && libraryCategoryIds.Contains(c.LibrarySelectableListCategoryId.Value))
                .ToListAsync();

            var libraryImportedCategoriesMap =
                libraryWithAlreadyImportedCategories
                    .Where(c => c.CompanyId == companyId && c.LibrarySelectableListCategoryId != null)
                    .Select(c => new
                    { LibraryCategoryId = c.LibrarySelectableListCategoryId.Value, CompanyCategoryId = c.Id })
                    .ToDictionary(categoryMap => categoryMap.LibraryCategoryId,
                        categoryMap => categoryMap.CompanyCategoryId);

            var libraryImportedCategoryIds = libraryImportedCategoriesMap.Keys;

            var libraryCategories = libraryWithAlreadyImportedCategories
                .Where(c => c.CompanyId == null);

            var newLibraryCategoriesToImport = libraryCategories
                .Where(c => !libraryImportedCategoryIds.Contains(c.Id))
                .ToList();

            if (!newLibraryCategoriesToImport.Any())
                return libraryImportedCategoriesMap;

            var newLibraryCategories = new List<SelectableListCategory>();

            foreach (var libraryCategory in newLibraryCategoriesToImport)
            {
                var newCategoryId = Guid.NewGuid();
                var newCategory = new SelectableListCategory
                {
                    Id = newCategoryId,
                    CompanyId = companyId,
                    LibrarySelectableListCategoryId = libraryCategory.Id,
                    Title = libraryCategory.Title,
                    Version = libraryCategory.Version,
                    IsActive = true
                };

                libraryImportedCategoriesMap.Add(libraryCategory.Id, newCategoryId);
                newLibraryCategories.Add(newCategory);
            }

            Repository.AddRange(newLibraryCategories);

            return libraryImportedCategoriesMap;
        }

        public Task<List<SelectableListCategoryVm>> GetByFilter(SearchFilterVm searchFilter)
        {
            var query = Repository.GetAll();

            var categoryTitle = searchFilter.Title;

            if (!string.IsNullOrEmpty(categoryTitle))
                query = query.Where(tt => tt.Title == categoryTitle);

            var templateTypeCompanyId = searchFilter.CompanyId;
            query = query.Where(tt => tt.CompanyId == templateTypeCompanyId);

            var isActiveEntity = searchFilter.IsActive;
            if (isActiveEntity != null)
                query = query.Where(tt => tt.IsActive == isActiveEntity.Value);

            return query.Take(searchFilter.Take)
                .ProjectTo<SelectableListCategoryVm>()
                .ToListAsync();
        }

        public async Task ActivateDeactivateCategory(Guid id, bool isActive)
        {
            var selectableList = await Repository.GetAll()
                .FirstOrDefaultAsync(tt => tt.Id == id);

            selectableList.IsActive = isActive;

            await Repository.SaveChangesAsync();
        }

        public IQueryable<SelectableListCategoryVm> LibraryGrid(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.CompanyId == null)
                .ProjectTo<SelectableListCategoryVm>();
        }

        public IEnumerable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.CompanyId == null)
                .ProjectTo<LookupViewModel>();
        }
    }
}