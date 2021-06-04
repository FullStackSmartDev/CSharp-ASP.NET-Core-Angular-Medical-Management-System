using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medico.Application.ViewModels.Admission;

namespace Medico.Application.Interfaces
{
    public interface IAdmissionService
    {
        Task<AdmissionVm> GetById(Guid id);
        
        Task<FullAdmissionInfoVm> GetFullAdmissionInfoById(Guid id);

        Task<AdmissionVm> GetByAppointmentId(Guid appointmentId);

        Task<AdmissionVm> Create(AdmissionVm admissionVm);

        Task<AdmissionVm> Update(AdmissionVm admissionVm);

        Task<IEnumerable<AdmissionVm>> GetPreviousPatientAdmissions(Guid patientId, DateTime fromDate);

        Task Delete(Guid id);
    }
}
