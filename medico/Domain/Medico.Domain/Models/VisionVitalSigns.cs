using System;

namespace Medico.Domain.Models
{
    public class VisionVitalSigns : Entity
    {
        public Guid PatientId { get; set; }

        public Patient Patient { get; set; }

        public bool WithGlasses { get; set; }

        public int Od { get; set; }

        public int Os { get; set; }

        public int Ou { get; set; }

        public DateTime CreateDate { get; set; }
    }
}