using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IUserService
    {
        IQueryable<MedicoApplicationUserViewModel> GetAll();

        Task<MedicoApplicationUserViewModel> GetById(Guid id);

        Task<MedicoApplicationUserViewModel> Create(MedicoApplicationUserViewModel locationViewModel);

        Task<MedicoApplicationUserViewModel> Update(MedicoApplicationUserViewModel locationViewModel);

        Task Delete(Guid id);

        IQueryable<LookupViewModel> Lookup(UserDxOptionsViewModel loadOptions);

        IQueryable<MedicoApplicationUserViewModel> Grid(CompanyDxOptionsViewModel loadOptions);

        Task<MedicoApplicationUserViewModel> GetByUserId(Guid id);

        Task<IEnumerable<LookupViewModel>> GetUserCompanies(string email);
    }
}
