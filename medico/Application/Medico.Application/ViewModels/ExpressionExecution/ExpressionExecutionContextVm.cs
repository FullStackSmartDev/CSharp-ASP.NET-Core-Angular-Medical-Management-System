using System.Collections.Generic;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.ViewModels.Patient;
using Newtonsoft.Json.Linq;

namespace Medico.Application.ViewModels.ExpressionExecution
{
    public class ExpressionExecutionContextVm
    {
        public List<VitalSignsViewModel> VitalSigns { get; set; }
        
        public PatientVm Patient { get; set; }
        
        public BaseVitalSignsViewModel BaseVitalSigns { get; set; }
        
        public SelectableVariables SelectableVariables { get; set; }

        public IDictionary<string, JObject[]> ReferenceTables { get; set; }
    }
}