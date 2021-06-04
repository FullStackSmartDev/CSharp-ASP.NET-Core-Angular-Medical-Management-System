using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IIcdCodeService
    {
        IQueryable<IcdCodeViewModel> GetAll();

        IQueryable<IcdCodeViewModel> GetAllForLookup(DxOptionsViewModel dxOptions, int lookupItemsCount);

        IQueryable<IcdCodeKeywordsViewModel> GetIcdCodeKeywords();

        Task<IcdCodeViewModel> GetById(Guid id);

        Task<IEnumerable<IcdCodeViewModel>> GetIcdCodesMappedToKeyword(string keyword);
    }
}
