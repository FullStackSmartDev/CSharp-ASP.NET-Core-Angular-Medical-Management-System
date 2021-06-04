using System;
using System.ComponentModel.DataAnnotations;
using Medico.Domain.Enums;

namespace Medico.Application.ViewModels.Patient
{
    public class PatientVm : BaseViewModel
    {
        [Required] public Guid CompanyId { get; set; }
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }

        public string NameSuffix { get; set; }
        public string MiddleName { get; set; }
        [Required] public int Gender { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }

        [Required] public int MaritalStatus { get; set; }
        [Required] public string Ssn { get; set; }
        [Required] public string PrimaryAddress { get; set; }
        public string SecondaryAddress { get; set; }
        [Required] public string City { get; set; }
        [Required] public string PrimaryPhone { get; set; }
        public string SecondaryPhone { get; set; }
        public string Email { get; set; }
        [Required] public string Zip { get; set; }
        [Required] public ZipCodeType ZipCodeType { get; set; }
        [Required] public int State { get; set; }

        public Guid? PatientInsuranceId { get; set; }
        
        public string Notes { get; set; }
    }
}