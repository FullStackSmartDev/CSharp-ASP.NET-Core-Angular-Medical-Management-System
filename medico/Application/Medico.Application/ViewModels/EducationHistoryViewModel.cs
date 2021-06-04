using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class EducationHistoryViewModel : BaseViewModel
    {
        [Required] public Guid PatientId { get; set; }

        public DateTime? CreateDate { get; set; }

        [Required] public string Degree { get; set; }

        public int? YearCompleted { get; set; }

        public string Notes { get; set; }
    }
}