using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class Location : BaseActiveEntity
    {
        public Guid CompanyId { get; set; }

        public Company Company { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string Fax { get; set; }

        public string Phone { get; set; }

        public string SecondaryAddress { get; set; }

        public List<Room> Rooms { get; set; }

        public IEnumerable<Appointment> Appointments { get; set; }

        public IEnumerable<Employee> Employees { get; set; }
    }
}
