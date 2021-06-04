using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class Company : BaseEntity
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string ZipCode { get; set; }

        public string Phone { get; set; }

        public string Fax { get; set; }

        public string WebSiteUrl { get; set; }

        public List<PatientDemographic> PatientDemographics { get; set; }

        public List<Employee> Employees { get; set; }

        public List<Location> Locations { get; set; }

        public List<Appointment> Appointments { get; set; }

        public List<TemplateLookupItem> TemplateLookupItems { get; set; }

        public Guid? PatientDataModelId { get; set; }

        public PatientDataModel PatientDataModel { get; set; }
    }
}
