using System;
using System.Threading.Tasks;

namespace Medico.Application.Interfaces
{
    public interface ICompanySecurityService
    {
        Task<bool> UserHaveAccessToCompany(Guid companyId);

        Task<bool> UserHaveAccessToCompanyPatient(Guid patientId);

        Task<bool> UserHaveAccessToCompanyAdmission(Guid admissionId);

        Task<bool> UserHaveAccessToCompanyLocation(Guid locationId);

        Task<bool> UserHaveAccessToCompanyRoom(Guid roomId);

        Task<bool> UserHaveAccessToCompanyEmployee(Guid roomId);

        Task<bool> UserHaveAccessToCompanyDocument(Guid roomId);
    }
}
