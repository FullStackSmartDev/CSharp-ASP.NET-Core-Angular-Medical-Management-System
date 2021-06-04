using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Expression;

namespace Medico.Application.Interfaces
{
    public interface IExpressionService
    {
        Task<List<ExpressionVm>> GetAll(Expression<Func<ExpressionVm, bool>> predicate);
        
        Task<ExpressionVm> GetById(Guid id);

        Task<CreateUpdateExpressionVm> Create(CreateUpdateExpressionVm expressionVm);

        Task<CreateUpdateExpressionVm> Update(CreateUpdateExpressionVm expressionVm);

        Task Delete(Guid id);

        IQueryable<ExpressionGridItemVm> Grid(CompanyDxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);
        
        IQueryable<ExpressionGridItemVm> LibraryGrid(DxOptionsViewModel loadOptions);

        IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);

        Task<IList<LookupViewModel>> GetReferenceTables(Guid expressionId);
        
        Task<List<ExpressionGridItemVm>> GetByFilter(ImportedItemsSearchFilterVm searchFilter);
        
        Task SyncWithLibraryExpression(Guid id);
        
        Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryExpressionIds,
            Guid companyId, bool commitChanges = false);
    }
}