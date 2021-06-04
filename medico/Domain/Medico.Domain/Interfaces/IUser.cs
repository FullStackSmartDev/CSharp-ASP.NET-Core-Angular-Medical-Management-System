using System;
using System.Threading.Tasks;

namespace Medico.Domain.Interfaces
{
    public interface IUser
    {
        string Name { get; }

        bool IsAuthenticated();

        bool IsInRole(string role);

        Task<bool> HasAccessToCompany(Guid companyId);

        Task<bool> HasAccessToCompanyPatient(Guid patientId);

        Task<bool> HasAccessToCompanyAdmission(Guid admissionId);

        Task<bool> HasAccessToCompanyLocation(Guid locationId);

        Task<bool> HasAccessToCompanyRoom(Guid roomId);

        Task<bool> HasAccessToCompanyEmployee(Guid employeeId);

        Task<bool> HasAccessToCompanyDocument(Guid documentId);
    }
}