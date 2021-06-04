using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableListCategory;

namespace Medico.Application.Interfaces
{
    public interface ISelectableListCategoryService
    {
        IQueryable<SelectableListCategoryVm> GetAll();

        Task<SelectableListCategoryVm> GetById(Guid id);

        Task<SelectableListCategoryVm> Create(SelectableListCategoryVm categoryViewModel);

        Task<SelectableListCategoryVm> Update(SelectableListCategoryVm categoryViewModel);

        Task Delete(Guid id);

        IQueryable<SelectableListCategoryVm> Grid(CompanyDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);

        Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid newCompanyId);

        Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryCategoryIds, Guid companyId);

        Task<List<SelectableListCategoryVm>> GetByFilter(SearchFilterVm searchFilter);

        Task ActivateDeactivateCategory(Guid id, bool isActive);

        IQueryable<SelectableListCategoryVm> LibraryGrid(DxOptionsViewModel loadOptions);

        IEnumerable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);
    }
}
