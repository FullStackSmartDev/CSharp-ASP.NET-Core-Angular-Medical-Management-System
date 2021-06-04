using System;

namespace Medico.Application.ViewModels
{
    public class AllegationsNotesStatusViewModel : BaseViewModel
    {
        public Guid AdmissionId { get; set; }

        public bool IsReviewed { get; set; }
    }
}
