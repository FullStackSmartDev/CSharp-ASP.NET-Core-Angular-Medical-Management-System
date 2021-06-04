using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.TemplateType;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class TemplateTypeService
        : BaseDeletableByIdService<TemplateType, TemplateTypeVm>, ITemplateTypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TemplateTypeService(ITemplateTypeRepository templateTypeRepository,
            IMapper mapper, IUnitOfWork unitOfWork) : base(templateTypeRepository, mapper)
        {
            _unitOfWork = unitOfWork;
        }

        public IQueryable<TemplateTypeVm> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<TemplateTypeVm>();
        }

        public async Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid companyId)
        {
            var libraryTemplateTypes = await Repository
                .GetAll()
                .Where(tt => tt.IsActive && tt.CompanyId == null)
                .ToListAsync();

            var templateTypesMap = new Dictionary<Guid, Guid>();

            foreach (var libraryTemplateType in libraryTemplateTypes)
            {
                var companyTemplateTypeId = Guid.NewGuid();
                var libraryTemplateTypeId = libraryTemplateType.Id;

                templateTypesMap.Add(libraryTemplateTypeId, companyTemplateTypeId);

                var companyTemplateType = new TemplateType
                {
                    Id = companyTemplateTypeId,
                    CompanyId = companyId,
                    IsActive = libraryTemplateType.IsActive,
                    IsPredefined = libraryTemplateType.IsPredefined,
                    LibraryTemplateTypeId = libraryTemplateTypeId,
                    Name = libraryTemplateType.Name,
                    Title = libraryTemplateType.Title
                };

                Repository.Add(companyTemplateType);
            }

            return templateTypesMap;
        }

        public async Task Delete(Guid id)
        {
            var templateType = await Repository.GetAll()
                .Include(tt => tt.LibraryRelatedTemplateTypes)
                .FirstOrDefaultAsync(tt => tt.Id == id);
            
            if (templateType == null)
                return;

            var libraryRelatedTemplateTypes = 
                templateType.LibraryRelatedTemplateTypes;

            if (libraryRelatedTemplateTypes.Any())
            {
                foreach (var relatedTemplateType in libraryRelatedTemplateTypes)
                {
                    relatedTemplateType.LibraryTemplateTypeId = null;
                }
            }
            
            ((IDeletableByIdRepository<TemplateType>)Repository).Remove(id);

            await _unitOfWork.Commit();
        }

        public IQueryable<TemplateTypeVm> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<TemplateTypeVm>().AsQueryable();

            return Repository.GetAll().Where(t => t.CompanyId == companyId)
                .ProjectTo<TemplateTypeVm>();
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>().AsQueryable();

            return Repository.GetAll().Where(t => t.CompanyId == companyId && t.IsActive)
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<TemplateTypeVm> LibraryGrid(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.CompanyId == null)
                .ProjectTo<TemplateTypeVm>();
        }

        public IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.CompanyId == null)
                .ProjectTo<LookupViewModel>();
        }

        public Task<List<TemplateTypeVm>> GetByFilter(TemplateTypeSearchFilterVm searchFilter)
        {
            var query = Repository.GetAll();

            var templateTypeName = searchFilter.Name;

            if (!string.IsNullOrEmpty(templateTypeName))
                query = query.Where(tt => tt.Name == templateTypeName);

            var templateTypeCompanyId = searchFilter.CompanyId;
            query = query.Where(tt => tt.CompanyId == templateTypeCompanyId);

            var isActiveEntity = searchFilter.IsActive;
            if (isActiveEntity != null)
                query = query.Where(tt => tt.IsActive == isActiveEntity.Value);

            var templateId = searchFilter.TemplateId;
            if (templateId.HasValue)
                query = query.Include(tt => tt.Templates)
                    .Where(tt => tt.Templates.FirstOrDefault(t => t.Id == templateId.Value) != null);

            if (searchFilter.Take != 0)
                query = query.Take(searchFilter.Take);
            
            return query
                .ProjectTo<TemplateTypeVm>()
                .ToListAsync();
        }

        public async Task ActivateTemplate(Guid id)
        {
            var templateType = await Repository.GetAll()
                .FirstOrDefaultAsync(tt => tt.Id == id);

            templateType.IsActive = true;

            await Repository.SaveChangesAsync();
        }

        public async Task DeactivateTemplate(Guid id)
        {
            var templateType = await Repository.GetAll()
                .FirstOrDefaultAsync(tt => tt.Id == id);

            templateType.IsActive = false;

            await Repository.SaveChangesAsync();
        }

        public async Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryTemplateTypeIds, Guid companyId)
        {
            var libraryWithAlreadyImportedTemplateTypes = await Repository.GetAll()
                .Where(tt => tt.CompanyId == null && libraryTemplateTypeIds.Contains(tt.Id) ||
                            tt.CompanyId == companyId && tt.LibraryTemplateTypeId != null
                            && libraryTemplateTypeIds.Contains(tt.LibraryTemplateTypeId.Value))
                .ToListAsync();

            var libraryImportedTemplateTypeMap =
                libraryWithAlreadyImportedTemplateTypes
                    .Where(tt => tt.CompanyId == companyId && tt.LibraryTemplateTypeId != null)
                    .Select(tt => new
                    { LibraryTemplateTypeId = tt.LibraryTemplateTypeId.Value, CompanyTemplateTypeId = tt.Id })
                    .ToDictionary(tt => tt.LibraryTemplateTypeId,
                        tt => tt.CompanyTemplateTypeId);

            var libraryTemplateTypes =
                libraryWithAlreadyImportedTemplateTypes
                    .Where(c => c.CompanyId == null)
                    .ToList();

            var libraryImportedTemplateTypeIds = libraryImportedTemplateTypeMap.Keys;

            var newLibraryTemplateTypesToImport = libraryTemplateTypes
                .Where(c => !libraryImportedTemplateTypeIds.Contains(c.Id))
                .ToList();

            if (!newLibraryTemplateTypesToImport.Any())
                return libraryImportedTemplateTypeMap;

            var newLibrarySelectableLists = new List<TemplateType>();

            foreach (var templateType in newLibraryTemplateTypesToImport)
            {
                var newTemplateTypeId = Guid.NewGuid();
                var newTemplateType = new TemplateType
                {
                    Id = newTemplateTypeId,
                    CompanyId = companyId,
                    LibraryTemplateTypeId = templateType.Id,
                    Title = templateType.Title,
                    Name = templateType.Name,
                    IsPredefined = templateType.IsPredefined,
                    IsActive = true
                };

                libraryImportedTemplateTypeMap.Add(templateType.Id, newTemplateTypeId);
                newLibrarySelectableLists.Add(newTemplateType);
            }

            Repository.AddRange(newLibrarySelectableLists);

            return libraryImportedTemplateTypeMap;
        }
    }
}
