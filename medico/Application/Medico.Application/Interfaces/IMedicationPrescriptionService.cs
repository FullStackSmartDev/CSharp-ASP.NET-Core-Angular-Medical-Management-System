using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IMedicationPrescriptionService
    {
        Task<MedicationPrescriptionViewModel> GetById(Guid id);

        Task<bool> IsPrescriptionExist(Guid admissionId);

        Task<MedicationPrescriptionViewModel> Create(MedicationPrescriptionViewModel medicationPrescriptionViewModel);

        Task<MedicationPrescriptionViewModel> Update(MedicationPrescriptionViewModel medicationPrescriptionViewModel);

        Task DeleteById(Guid id);

        IQueryable<MedicationPrescriptionViewModel> GetAll(PatientAdmissionDxOptionsViewModel patientAdmissionDxOptions);

        Task<IEnumerable<MedicationPrescriptionViewModel>> GetByAdmissionId(Guid admissionId);
    }
}
