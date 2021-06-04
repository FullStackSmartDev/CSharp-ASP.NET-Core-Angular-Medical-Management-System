using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class Room : Entity
    {
        public bool IsActive { get; set; }

        public Guid LocationId { get; set; }

        public Location Location { get; set; }

        public string Name { get; set; }

        public List<Appointment> Appointments { get; set; }
    }
}
