using System;
using System.ComponentModel.DataAnnotations;
using Medico.Application.ViewModels.Patient;

namespace Medico.Application.ViewModels
{
    public class PatientInsuranceViewModel : PatientVm
    {
        [Required] public Guid PatientId { get; set; }

        [Required] public string CaseNumber { get; set; }

        [Required] public string RqId { get; set; }
    }
}