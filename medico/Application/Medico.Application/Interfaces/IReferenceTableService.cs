using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.ReferenceTable;

namespace Medico.Application.Interfaces
{
    public interface IReferenceTableService
    {
        Task<List<ReferenceTableVm>> GetAll(Expression<Func<ReferenceTableVm, bool>> predicate);
        
        IQueryable<ReferenceTableGridItemVm> LibraryGrid(DxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);

        IQueryable<ReferenceTableGridItemVm> Grid(CompanyDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);

        Task<ReferenceTableVm> GetById(Guid id);

        Task<ReferenceTableVm> Update(ReferenceTableVm referenceTable);

        Task<List<ReferenceTableGridItemVm>> GetByFilter(ImportedItemsSearchFilterVm searchFilter);

        Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryReferenceTableIds,
            Guid companyId, bool commitChanges = false);

        Task SyncWithLibraryReferenceTable(Guid id);
    }
}