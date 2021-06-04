using System;

namespace Medico.Application.ViewModels.Patient
{
    public class PatientPatchVm
    {
        public Guid Id { get; set; }
        
        public string Notes { get; set; }
    }
}