using System;
using Medico.Domain.Enums;

namespace Medico.Application.ViewModels
{
    public class MedicationsUpdateItemViewModel : BaseViewModel
    {
        public DateTime Date { get; set; }

        public MedicationUpdateStatus Status { get; set; }

        public string MedicationsFilePath { get; set; }

        public string MedicationsFileName { get; set; }

        public string Error { get; set; }
    }
}
