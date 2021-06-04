using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IVitalSignsService
    {
        Task<VitalSignsViewModel> GetById(Guid id);

        Task<VitalSignsViewModel> Create(VitalSignsViewModel vitalSignsViewModel);

        Task<VitalSignsViewModel> Update(VitalSignsViewModel vitalSignsViewModel);

        Task Delete(Guid id);

        IQueryable<VitalSignsViewModel> GetAll(PatientAdmissionDxOptionsViewModel vitalSignsDxOptionsViewModel);

        Task<IEnumerable<VitalSignsViewModel>> GetByPatientAndAdmissionIds(Guid patientId, Guid admissionId);

        Task<VitalSignsViewModel> GetLastPatientVitalSigns(Guid patientId, DateTime createDate);
    }
}