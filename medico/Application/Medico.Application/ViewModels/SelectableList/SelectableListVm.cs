using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.SelectableList
{
    public class SelectableListVm : SelectableListGridItemVm
    {
        [Required]
        public IEnumerable<SelectableListValueViewModel> SelectableListValues { get; set; }
    }
}