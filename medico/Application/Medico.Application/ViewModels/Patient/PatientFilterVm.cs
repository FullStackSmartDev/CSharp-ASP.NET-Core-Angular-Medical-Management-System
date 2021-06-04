using System;

namespace Medico.Application.ViewModels.Patient
{
    public class PatientFilterVm : SearchFilterVm
    {
        public string LastName { get; set; }
        
        public string FirstName { get; set; }
        
        public string Ssn { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
    }
}