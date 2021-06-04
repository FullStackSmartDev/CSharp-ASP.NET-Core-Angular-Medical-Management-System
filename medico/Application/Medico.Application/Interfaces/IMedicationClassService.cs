using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IMedicationClassService
    {
        IQueryable<LookupViewModel> GetAllForLookup(DxOptionsViewModel loadOptions, int lookupItemsCount);

        Task<LookupViewModel> GetById(Guid id);
    }
}
