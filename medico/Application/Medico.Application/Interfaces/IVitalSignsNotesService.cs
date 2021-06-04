using System;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IVitalSignsNotesService
    {
        Task<VitalSignsNotesViewModel> GetByAdmissionId(Guid admissionId);

        Task<VitalSignsNotesViewModel> Create(VitalSignsNotesViewModel vitalSignsNotesViewModel);

        Task<VitalSignsNotesViewModel> Update(VitalSignsNotesViewModel vitalSignsNotesViewModel);
    }
}
