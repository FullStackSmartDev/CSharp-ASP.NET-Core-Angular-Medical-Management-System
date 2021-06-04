using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class ReferenceTable : Entity
    {
        public Guid? LibraryReferenceTableId { get; set; }
        public ReferenceTable LibraryReferenceTable { get; set; }
        public int? Version { get; set; }
        public Guid? CompanyId { get; set; }
        public Company Company { get; set; }
        public string Title { get; set; }
        public string Data { get; set; }
        public List<ReferenceTable> LibraryRelatedReferenceTables { get; set; }
        public List<ExpressionReferenceTable> ReferenceTableExpressions { get; set; }
    }
}