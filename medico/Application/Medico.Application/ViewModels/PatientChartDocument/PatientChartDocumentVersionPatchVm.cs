using System;

namespace Medico.Application.ViewModels.PatientChartDocument
{
    public class PatientChartDocumentVersionPatchVm : VersionPatchVm
    {
        public Guid PatientChartRootNodeId { get; set; }
    }
}