using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels.Company;

namespace Medico.Application.Interfaces
{
    public interface ICompanyService
    {
        IQueryable<CompanyVm> GetAll();

        Task<CompanyVm> GetById(Guid id);

        Task<CompanyVm> Create(CompanyVm companyViewModel);

        Task<CompanyVm> Update(CompanyVm companyViewModel);

        Task<CompanyVm> CreateNewApplicationCompany(CompanyVm companyViewModel);

        Task<List<CompanyVm>> GetByFilter(CompanySearchFilterVm companySearchFilterVm);
    }
}