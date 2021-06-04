using System;

namespace Medico.Application.ViewModels.PatientChartDocument
{
    public class PatientChartDocumentFilterVm : SearchFilterVm
    {
        public Guid? PatientChartDocumentId { get; set; }
    }
}