using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Template;

namespace Medico.Application.Interfaces
{
    public interface ITemplateService
    {
        IQueryable<TemplateVm> GetAll();

        Task<TemplateVm> GetById(Guid id);

        Task<TemplateVm> Create(TemplateVm templateViewModel);

        Task<TemplateVm> Update(TemplateVm templateViewModel);

        Task Delete(Guid id);

        Task<IEnumerable<TemplateWithTypeNameViewModel>> GetRequired(Guid companyId);

        Task<IEnumerable<TemplateVm>> GetChiefComplaintTemplates(Guid chiefComplaintId);
        
        IQueryable<TemplateGridItemVm> Grid(TemplateDxOptionsViewModel loadOptions);

        IQueryable<TemplateGridItemVm> LibraryGrid(TemplateDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> Lookup(TemplateDxOptionsViewModel loadOptions);

        Task ActivateTemplate(Guid id);

        Task DeactivateTemplate(Guid id);

        Task ReorderTemplates(TemplatesOrdersVm templatesOrders);

        Task<List<TemplateGridItemVm>> GetByFilter(TemplateSearchFilterVm templateSearchFilter);

        Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid newCompanyId,
            IDictionary<Guid, Guid> templateTypesMap, IDictionary<Guid, Guid> selectableListsMap);

        Task<Dictionary<Guid, Guid>> ImportFromLibrary(TemplatesImportPatchVm importedTemplates);

        Task SyncWithLibraryTemplate(Guid id);

        IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);
    }
}