using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class PatientChartDocumentNode : Entity
    {
        public Guid? LibraryPatientChartDocumentNodeId { get; set; }

        public PatientChartDocumentNode LibraryPatientChartDocumentNode { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string Title { get; set; }

        public string Name { get; set; }

        public string PatientChartDocumentNodeJsonString { get; set; }

        public List<PatientChartDocumentNode> LibraryPatientChartDocumentNodes { get; set; }

        public List<Appointment> Appointments { get; set; }
    }
}