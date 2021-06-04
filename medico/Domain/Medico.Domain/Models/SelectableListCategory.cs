using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class SelectableListCategory : Entity
    {
        public Guid? LibrarySelectableListCategoryId { get; set; }

        public SelectableListCategory LibrarySelectableListCategory { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string Title { get; set; }

        public bool IsActive { get; set; }

        public List<SelectableList> SelectableLists { get; set; }

        public List<SelectableListCategory> LibraryRelatedSelectableListCategories { get; set; }
    }
}
