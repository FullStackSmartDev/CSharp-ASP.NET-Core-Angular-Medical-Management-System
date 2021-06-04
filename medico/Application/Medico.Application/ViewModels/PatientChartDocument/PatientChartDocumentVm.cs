using System;
using Medico.Application.Services.PatientChart;

namespace Medico.Application.ViewModels.PatientChartDocument
{
    public class PatientChartDocumentVm
    {
        public PatientChartNode PatientChart { get; set; }

        public Guid? CompanyId { get; set; }
    }
}