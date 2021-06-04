using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IMedicalHistoryService
    {
        Task<IEnumerable<MedicalHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<MedicalHistoryViewModel> GetById(Guid id);

        Task<bool> IsHistoryExist(Guid patientId);

        Task<MedicalHistoryViewModel> Create(MedicalHistoryViewModel medicalHistoryViewModel);

        Task<MedicalHistoryViewModel> Update(MedicalHistoryViewModel medicalHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<MedicalHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<MedicalHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}