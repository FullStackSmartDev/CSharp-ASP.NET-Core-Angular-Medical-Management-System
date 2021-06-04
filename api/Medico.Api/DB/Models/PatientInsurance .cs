using System;
using Medico.Api.DB.Enums;

namespace Medico.Api.DB.Models
{
    public class PatientInsurance : BaseEntity
    {
        public Guid PatientDemographicId { get; set; }

        public PatientDemographic PatientDemographic { get; set; }
        
        public string CaseNumber { get; set; }

        public string RqId { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public Gender Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string Ssn { get; set; }

        public string Zip { get; set; }

        public string PrimaryAddress { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public string PrimaryPhone { get; set; }

        public string SecondaryPhone { get; set; }

        public string Email { get; set; }

        public State State { get; set; }
    }
}
