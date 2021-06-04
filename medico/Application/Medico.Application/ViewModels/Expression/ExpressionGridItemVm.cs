using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.Expression
{
    public class ExpressionGridItemVm : BaseViewModel
    {
        public Guid? LibraryExpressionId { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        [Required]
        public string Title { get; set; }
    }
}