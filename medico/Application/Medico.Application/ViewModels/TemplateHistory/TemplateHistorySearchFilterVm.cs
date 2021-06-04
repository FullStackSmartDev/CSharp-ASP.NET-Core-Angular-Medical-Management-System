using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.TemplateHistory
{
    public class TemplateHistorySearchFilterVm
    {
        [Required] public Guid AdmissionId { get; set; }

        [Required] public Guid TemplateId { get; set; }
    }
}