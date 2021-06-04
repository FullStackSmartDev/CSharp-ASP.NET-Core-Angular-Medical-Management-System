using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class Room : BaseActiveEntity
    {
        public Guid LocationId { get; set; }

        public Location Location { get; set; }

        public string Name { get; set; }

        public List<Appointment> Appointments { get; set; }
    }
}
