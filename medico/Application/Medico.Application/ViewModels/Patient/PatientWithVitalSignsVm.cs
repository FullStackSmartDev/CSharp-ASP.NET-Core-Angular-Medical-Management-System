namespace Medico.Application.ViewModels.Patient
{
    public class PatientWithVitalSignsVm
    {
        public PatientVm Patient { get; set; }
        
        public BaseVitalSignsViewModel BaseVitalSigns { get; set; }
    }
}