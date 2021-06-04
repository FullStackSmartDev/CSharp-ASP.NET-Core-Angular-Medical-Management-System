using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.TemplateType;

namespace Medico.Application.Interfaces
{
    public interface ITemplateTypeService
    {
        IQueryable<TemplateTypeVm> GetAll();

        Task<TemplateTypeVm> GetById(Guid id);

        Task<TemplateTypeVm> Create(TemplateTypeVm templateTypeViewModel);

        Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid companyId);

        Task<TemplateTypeVm> Update(TemplateTypeVm templateTypeViewModel);

        Task Delete(Guid id);

        IQueryable<TemplateTypeVm> Grid(CompanyDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);

        IQueryable<TemplateTypeVm> LibraryGrid(DxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);

        Task<List<TemplateTypeVm>> GetByFilter(TemplateTypeSearchFilterVm searchFilter);

        Task ActivateTemplate(Guid id);

        Task DeactivateTemplate(Guid id);

        Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryTemplateTypeIds, Guid companyId);
    }
}