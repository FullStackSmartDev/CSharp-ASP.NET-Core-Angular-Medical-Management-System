using System;
using System.Collections.Generic;
using Medico.Domain.Enums;

namespace Medico.Domain.Models
{
    public class Location : Entity
    {
        public Guid CompanyId { get; set; }

        public Company Company { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public int State { get; set; }

        public string Zip { get; set; }

        public ZipCodeType ZipCodeType { get; set; }

        public string Fax { get; set; }

        public string Phone { get; set; }

        public string SecondaryAddress { get; set; }

        public List<Room> Rooms { get; set; }

        public List<Appointment> Appointments { get; set; }
    }
}
