using System;
using Medico.Domain.Enums;

namespace Medico.Domain.Models
{
    public class MedicationsUpdateItem : Entity
    {
        public DateTime Date { get; set; }

        public MedicationUpdateStatus Status { get; set; }

        public string MedicationsFilePath { get; set; }

        public string MedicationsFileName { get; set; }

        public string Error { get; set; }
    }
}
