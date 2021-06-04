using System.ComponentModel.DataAnnotations;
using Medico.Domain.Enums;

namespace Medico.Application.ViewModels.Company
{
    public class CompanyVm : BaseViewModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }

        public string SecondaryAddress { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public int State { get; set; }

        [Required]
        public string ZipCode { get; set; }

        [Required]
        public ZipCodeType ZipCodeType { get; set; }

        [Required]
        public string Phone { get; set; }

        [Required]
        public string Fax { get; set; }

        public string WebSiteUrl { get; set; }

        public bool IsActive { get; set; }
    }
}
