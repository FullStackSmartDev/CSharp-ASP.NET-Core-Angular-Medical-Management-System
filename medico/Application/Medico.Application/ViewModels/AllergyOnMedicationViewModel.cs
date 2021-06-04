using System;

namespace Medico.Application.ViewModels
{
    public class AllergyOnMedicationViewModel
    {
        public Guid PatientId { get; set; }

        public Guid? MedicationNameId { get; set; }

        public string MedicationName { get; set; }

        public Guid? MedicationClassId { get; set; }

        public string MedicationClass { get; set; }
    }
}
