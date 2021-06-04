using System;

namespace Medico.Domain.Models
{
    public class TemplateSelectableList
    {
        public Guid TemplateId { get; set; }

        public Template Template { get; set; }

        public Guid SelectableListId { get; set; }

        public SelectableList SelectableList { get; set; }
    }
}