using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class VisionVitalSignsViewModel : BaseViewModel
    {
        [Required]
        public Guid PatientId { get; set; }

        public bool WithGlasses { get; set; }

        public int Od { get; set; }

        public int Os { get; set; }

        public int Ou { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }
    }
}
