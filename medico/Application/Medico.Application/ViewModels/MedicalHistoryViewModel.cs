using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class MedicalHistoryViewModel : BaseViewModel
    {
        public string Notes { get; set; }

        [Required] public Guid PatientId { get; set; }

        public DateTime? CreateDate { get; set; }

        [Required] public string Diagnosis { get; set; }
    }
}