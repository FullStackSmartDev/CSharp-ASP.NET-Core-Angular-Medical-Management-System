using Medico.Api.DB.Models;
using System.Collections.Generic;

namespace Medico.Api.ViewModel
{
    public class AdmissionPushViewModel
    {
        public IEnumerable<Admission> Admissions { get; set; }

        public IEnumerable<Appointment> Appointments { get; set; }
    }
}
