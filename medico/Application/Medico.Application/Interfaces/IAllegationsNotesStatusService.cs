using System;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IAllegationsNotesStatusService
    {
        Task<AllegationsNotesStatusViewModel> Create(AllegationsNotesStatusViewModel allegationsNotesStatusViewModel);

        Task<AllegationsNotesStatusViewModel> GetByAdmissionId(Guid admissionId);
    }
}
