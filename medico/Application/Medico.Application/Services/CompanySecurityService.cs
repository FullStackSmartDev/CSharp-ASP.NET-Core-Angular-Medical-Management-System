using System;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Domain.Interfaces;

namespace Medico.Application.Services
{
    public class CompanySecurityService : ICompanySecurityService
    {
        private readonly IUser _user;

        public CompanySecurityService(IUser user)
        {
            _user = user;
        }

        public Task<bool> UserHaveAccessToCompany(Guid companyId)
        {
            return _user.HasAccessToCompany(companyId);
        }

        public Task<bool> UserHaveAccessToCompanyPatient(Guid patientId)
        {
            return _user.HasAccessToCompanyPatient(patientId);
        }

        public Task<bool> UserHaveAccessToCompanyAdmission(Guid admissionId)
        {
            return _user.HasAccessToCompanyAdmission(admissionId);
        }

        public Task<bool> UserHaveAccessToCompanyLocation(Guid locationId)
        {
            return _user.HasAccessToCompanyLocation(locationId);
        }
            
        public Task<bool> UserHaveAccessToCompanyRoom(Guid roomId)
        {   
            return _user.HasAccessToCompanyRoom(roomId);
        }

        public Task<bool> UserHaveAccessToCompanyEmployee(Guid employeeId)
        {
            return _user.HasAccessToCompanyEmployee(employeeId);
        }   

        public Task<bool> UserHaveAccessToCompanyDocument(Guid documentId)
        {
            return _user.HasAccessToCompanyDocument(documentId);
        }
    }
}
