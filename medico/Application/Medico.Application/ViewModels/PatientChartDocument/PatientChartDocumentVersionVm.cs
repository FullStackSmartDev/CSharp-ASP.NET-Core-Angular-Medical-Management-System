using System;

namespace Medico.Application.ViewModels.PatientChartDocument
{
    public class PatientChartDocumentVersionVm : BaseViewModel
    {
        public Guid? LibraryPatientChartDocumentNodeId { get; set; }

        public int? LibraryPatientChartDocumentNodeVersion { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        public string Title { get; set; }

        public string Name { get; set; }
    }
}
