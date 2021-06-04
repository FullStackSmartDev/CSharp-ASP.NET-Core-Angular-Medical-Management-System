using System;
using System.ComponentModel.DataAnnotations;
using Medico.Domain.Enums;

namespace Medico.Application.ViewModels
{
    public class MedicoApplicationUserViewModel : BaseActiveCompanyRelatedViewModel
    {
        [Required]
        public string Role { get; set; }

        public string RoleName { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string NamePrefix { get; set; }

        public string NameSuffix { get; set; }

        public string MiddleName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Address { get; set; }

        public string SecondaryAddress { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public int State { get; set; }

        [Required]
        public string Zip { get; set; }

        [Required]
        public ZipCodeType ZipCodeType { get; set; }

        [Required]
        public string PrimaryPhone { get; set; }

        public string SecondaryPhone { get; set; }

        [Required]
        public int EmployeeType { get; set; }

        [Required]
        public string Ssn { get; set; }

        [Required]
        public int Gender { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }
    }
}