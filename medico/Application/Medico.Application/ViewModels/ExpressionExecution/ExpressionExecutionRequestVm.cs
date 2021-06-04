using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels.ExpressionExecution
{
    public class ExpressionExecutionRequestVm
    {
        public Guid AdmissionId { get; set; }
        public string DetailedTemplateContent { get; set; }
        
        public IEnumerable<Guid> ReferenceTableIds { get; set; }
    }
}