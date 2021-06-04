using System;

namespace Medico.Api.DB.Models
{
    public class Medication
    {
        public Guid Id { get; set; }

        public string NdcCode { get; set; }

        public string PackageDescription { get; set; }

        public string ElevenDigitNdcCode { get; set; }

        public string NonProprietaryName { get; set; }

        public string DosageFormName { get; set; }

        public string RouteName { get; set; }

        public string SubstanceName { get; set; }

        public string StrengthNumber { get; set; }

        public string StrengthUnit { get; set; }

        public string PharmaceuticalClasses { get; set; }

        public string DeaSchedule { get; set; }

        public string Status { get; set; }

        public DateTime? LastUpdate { get; set; }
    }
}
