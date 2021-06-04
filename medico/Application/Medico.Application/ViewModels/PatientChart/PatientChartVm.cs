using System;
using Medico.Application.Services.PatientChart;

namespace Medico.Application.ViewModels.PatientChart
{
    public class PatientChartVm
    {
        public PatientChartNode PatientChart { get; set; }

        public Guid? CompanyId { get; set; }

        public Guid? PatientChartDocumentId { get; set; }
    }
}