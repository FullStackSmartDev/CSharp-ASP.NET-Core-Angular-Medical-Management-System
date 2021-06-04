using System;
using System.Collections.Generic;
using Medico.Api.DB.Enums;

namespace Medico.Api.DB.Models
{
    public class Employee : BaseActiveEntity
    {
        public Guid CompanyId { get; set; }

        public Company Company { get; set; }

        public string FirstName { get; set; }

        public string NamePrefix { get; set; }

        public string NameSuffix { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Address { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string PrimaryPhone { get; set; }

        public string SecondaryPhone { get; set; }

        public EmployeeType EmployeeType { get; set; }

        public string Ssn { get; set; }

        public Gender Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public Guid AppUserId { get; set; }

        public AppUser AppUser { get; set; }

        public List<SignatureInfo> SignatureInfos { get; set; }
    }
}
