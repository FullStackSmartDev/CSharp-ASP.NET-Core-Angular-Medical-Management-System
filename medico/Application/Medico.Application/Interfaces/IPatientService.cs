using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Patient;

namespace Medico.Application.Interfaces
{
    public interface IPatientService
    {
        IQueryable<PatientProjectionViewModel> GetAll();

        Task<PatientVm> GetById(Guid id);

        Task<PatientWithVitalSignsVm> GetByIdWithVitalSigns(Guid id);

        Task<PatientVm> Create(PatientVm patientVm);

        Task<PatientVm> Update(PatientVm patientVm);

        Task Delete(Guid id);

        IQueryable<LookupViewModel> Lookup(DateRangeDxOptionsViewModel loadOptions);

        Task<List<PatientVm>> GetByFilter(PatientFilterVm patientSearchFilter);

        Task UpdatePatientNotes(PatientPatchVm patientNotesPatch);
    }
}