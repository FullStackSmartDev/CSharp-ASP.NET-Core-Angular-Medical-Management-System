using System;
using Medico.Api.DB.Enums;

namespace Medico.Api.DB.Models
{
    public class Address : BaseEntity
    {
        public AddressType AddressType { get; set; }

        public Guid PatientDemographicId { get; set; }

        public PatientDemographic PatinDemographic { get; set; }

        public string PrimaryAddress { get; set; }

        public string Zip { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public string PrimaryPhone { get; set; }

        public string SecondaryPhone { get; set; }

        public State State { get; set; }

        public string Email { get; set; }
    }
}
