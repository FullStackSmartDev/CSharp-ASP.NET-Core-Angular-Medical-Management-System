using System;

namespace Medico.Api.DB.Models
{
    public class BasePatientHistoryEntity : BaseEntity
    {
        public string Status { get; set; }

        public string Type { get; set; }

        public int? Amount { get; set; }

        public string Use { get; set; }

        public string Frequency { get; set; }

        public int? Length { get; set; }

        public string Duration { get; set; }

        public bool? Quit { get; set; }

        public int? StatusLength { get; set; }

        public string Notes { get; set; }

        public DateTime CreateDate { get; set; }

        public Guid PatientId { get; set; }

        public PatientDemographic Patient { get; set; }

        public string StatusLengthType { get; set; }
    }

    public class TobaccoHistory : BasePatientHistoryEntity
    {
    }
}