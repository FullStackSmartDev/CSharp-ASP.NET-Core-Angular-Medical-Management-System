using System;

namespace Medico.Application.ViewModels.PatientChartDocument
{
    public class PatientChartDocumentsImportVm : EntitiesImportPatchVm
    {
        public Guid PatientChartRootNodeId { get; set; }
    }
}