using System.ComponentModel.DataAnnotations;
using Medico.Domain.Enums;

namespace Medico.Application.ViewModels
{
    public class LocationViewModel : BaseActiveCompanyRelatedViewModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public int State { get; set; }

        [Required]
        public string Zip { get; set; }

        [Required]
        public ZipCodeType ZipCodeType { get; set; }

        [Required]
        public string Fax { get; set; }

        [Required]
        public string Phone { get; set; }

        public string SecondaryAddress { get; set; }
    }
}
