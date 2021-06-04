using System;

namespace Medico.Application.ViewModels
{
    public class SelectableListTrackItemViewModel
    {
        public Guid TemplateId { get; set; }

        public Guid SelectableListId { get; set; }

        public int NumberOfSelectableListsInTemplate { get; set; }
    }
}
