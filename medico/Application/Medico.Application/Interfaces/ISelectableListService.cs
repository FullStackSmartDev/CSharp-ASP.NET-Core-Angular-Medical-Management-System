using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.SelectableList;

namespace Medico.Application.Interfaces
{
    public interface ISelectableListService
    {
        Task<SelectableListVm> GetById(Guid id);

        Task<SelectableListVm> Create(SelectableListVm selectableListViewModel);

        Task<SelectableListVm> Update(SelectableListVm selectableListViewModel);

        Task Delete(Guid id);

        IQueryable<CompanyCategorySelectableListVm> Grid(CompanyDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);
        
        Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid newCompanyId,
            IDictionary<Guid, Guid> selectableListCategoriesMap);

        Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> librarySelectableListIds,
            Guid companyId, bool commitChanges = false);

        Task<List<SelectableListVm>> GetByFilter(SelectableListSearchFilterVm selectableListTitle);

        Task ActivateDeactivateSelectableList(Guid id, bool isActive);

        IQueryable<CategorySelectableListVm> LibraryGrid(DxOptionsViewModel loadOptions);

        Task SyncWithLibraryList(Guid id);
    }
}