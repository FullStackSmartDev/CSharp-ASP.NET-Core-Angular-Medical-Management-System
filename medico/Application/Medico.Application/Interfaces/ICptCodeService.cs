using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface ICptCodeService
    {
        IQueryable<CptCodeViewModel> GetAll();

        Task<CptCodeViewModel> GetById(Guid id);
    }
}