using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class SelectableList : Entity
    {
        public bool IsPredefined { get; set; }

        public Guid? LibrarySelectableListId { get; set; }

        public SelectableList LibrarySelectableList { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string JsonValues { get; set; }

        public SelectableListCategory Category { get; set; }

        public Guid CategoryId { get; set; }

        public string Title { get; set; }

        public bool IsActive { get; set; }

        public List<TemplateSelectableList> TemplateSelectableLists { get; set; }

        public List<SelectableList> LibraryRelatedSelectableLists { get; set; }
    }
}
