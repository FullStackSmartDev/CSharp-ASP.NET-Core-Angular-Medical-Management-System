using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IMedicationHistoryService
    {
        Task<IEnumerable<MedicationHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<MedicationHistoryViewModel> GetById(Guid id);

        Task<bool> IsHistoryExist(Guid patientId);

        Task<MedicationHistoryViewModel> Create(MedicationHistoryViewModel medicationHistoryViewModel);

        Task<MedicationHistoryViewModel> Create(MedicationPrescriptionViewModel medicationPrescriptionViewModel);

        Task<MedicationHistoryViewModel> Update(MedicationHistoryViewModel medicationHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<MedicationHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<MedicationHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}