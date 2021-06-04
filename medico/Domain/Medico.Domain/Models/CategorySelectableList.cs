using System;

namespace Medico.Domain.Models
{
    public class CategorySelectableList : Entity
    {
        public Guid? CompanyId { get; set; }

        public string Category { get; set; }

        public string Title { get; set; }

        public bool IsActive { get; set; }

        public bool IsPredefined { get; set; }

        public Guid? LibrarySelectableListId { get; set; }

        public int? Version { get; set; }
        
        public int? LibrarySelectableListVersion { get; set; }
    }
}