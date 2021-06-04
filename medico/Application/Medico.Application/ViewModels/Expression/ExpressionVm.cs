using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.Expression
{
    public class ExpressionVm : ExpressionGridItemVm
    {
        [Required]
        public string Template { get; set; }
    }
}