using System;
using System.Collections.Generic;
using Medico.Domain.Enums;

namespace Medico.Domain.Models
{
    public class MedicoApplicationUser : Entity
    {
        public bool IsActive { get; set; }

        public Guid CompanyId { get; set; }

        public Company Company { get; set; }

        public string FirstName { get; set; }

        public string NamePrefix { get; set; }

        public string NameSuffix { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Address { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public int State { get; set; }

        public string Zip { get; set; }

        public ZipCodeType ZipCodeType { get; set; }

        public string PrimaryPhone { get; set; }

        public string SecondaryPhone { get; set; }

        public int EmployeeType { get; set; }

        public string Ssn { get; set; }

        public int Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public List<SignatureInfo> Signatures { get; set; }

        public List<Appointment> Appointments { get; set; }
    }
}