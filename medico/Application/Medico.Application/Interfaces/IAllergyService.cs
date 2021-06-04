using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IAllergyService
    {
        Task<IEnumerable<AllergyViewModel>> GetByPatientId(Guid patientId);

        Task<AllergyViewModel> GetById(Guid id);

        Task<bool> IsAllergyExist(Guid patientId);

        Task<AllergyViewModel> Create(AllergyViewModel allergyViewModel);

        Task<AllergyViewModel> Update(AllergyViewModel allergyViewModel);

        Task Delete(Guid id);

        IQueryable<AllergyViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<AllergyViewModel>> GetByPatientIdAndDate(Guid patientId, DateTime date);

        Task<IEnumerable<AllergyViewModel>> GetAllByPatientId(Guid patientId);

        Task<AllergyOnMedicationViewModel> GetPatientAllergyOnMedication(Guid patientId, Guid medicationNameId);
    }
}