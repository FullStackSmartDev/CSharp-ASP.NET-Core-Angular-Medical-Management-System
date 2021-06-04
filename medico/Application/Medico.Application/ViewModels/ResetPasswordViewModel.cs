using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class ResetPasswordViewModel
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public string Code { get; set; }
    }
}
