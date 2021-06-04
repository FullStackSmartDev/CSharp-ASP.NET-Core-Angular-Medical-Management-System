using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface ILocationService
    {
        IQueryable<LocationViewModel> GetAll();

        Task<LocationViewModel> GetById(Guid id);

        Task<LocationViewModel> Create(LocationViewModel locationViewModel);

        Task<LocationViewModel> Update(LocationViewModel locationViewModel);

        Task Delete(Guid id);

        IQueryable<LookupViewModel> Lookup(DateRangeDxOptionsViewModel loadOptions);

        IQueryable<LocationViewModel> Grid(CompanyDxOptionsViewModel loadOptions);
    }
}