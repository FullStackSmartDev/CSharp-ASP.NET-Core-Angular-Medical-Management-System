using System.Collections.Generic;

namespace Medico.Application.ViewModels.Admission
{
    public class FullAdmissionInfoVm : AdmissionVm
    {
        public List<VitalSignsViewModel> VitalSigns { get; set; }

        public List<MedicationPrescriptionViewModel> MedicationPrescriptions { get; set; }
    }
}