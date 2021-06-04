using System;

namespace Medico.Application.ViewModels.SelectableList
{
    public class SelectableListSearchFilterVm : SearchFilterVm
    {
        public Guid? CategoryId { get; set; }
        
        public string LibrarySelectableListIds { get; set; }

        public Guid? LibrarySelectableListId { get; set; }

        public bool? ExcludeImported { get; set; }
    }
}