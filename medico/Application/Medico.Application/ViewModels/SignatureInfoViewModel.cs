using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class SignatureInfoViewModel : BaseActiveViewModel
    {
        [Required]
        public Guid PhysicianId { get; set; }

        [Required]
        public Guid AdmissionId { get; set; }

        [Required]
        public DateTime SignDate { get; set; }

        [Required]
        public bool IsUnsigned { get; set; }
    }
}
