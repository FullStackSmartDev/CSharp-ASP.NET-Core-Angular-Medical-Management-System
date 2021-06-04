using System;

namespace Medico.Application.ViewModels.PatientChartDocument
{
    public class PatientChartDocumentSearchVm : SearchFilterVm
    {   
        public bool? ExcludeImported { get; set; }

        public Guid? TemplateId { get; set; }
        
        public Guid? TemplateTypeId { get; set; }
    }
}
