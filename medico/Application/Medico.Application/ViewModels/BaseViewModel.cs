using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class BaseViewModel
    {
        public Guid Id { get; set; }
    }

    public class BaseActiveViewModel : BaseViewModel
    {
        [Required]
        public bool IsActive { get; set; }
    }

    public class BaseActiveCompanyRelatedViewModel : BaseActiveViewModel
    {
        [Required]
        public Guid CompanyId { get; set; }
    }

    public class CompanyRelatedViewModel : BaseViewModel
    {
        [Required]
        public Guid CompanyId { get; set; }
    }
}
