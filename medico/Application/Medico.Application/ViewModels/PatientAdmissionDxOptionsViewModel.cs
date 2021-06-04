using System;

namespace Medico.Application.ViewModels
{
    public class PatientAdmissionDxOptionsViewModel : HistoryDxOptionsViewModel
    {
        public Guid AdmissionId { get; set; }
    }
}