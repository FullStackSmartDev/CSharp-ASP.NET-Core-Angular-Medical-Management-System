using System;

namespace Medico.Domain.Models
{
    public class ExpressionReferenceTable
    {
        public Guid ReferenceTableId { get; set; }

        public ReferenceTable ReferenceTable { get; set; }

        public Guid ExpressionId { get; set; }

        public Expression Expression { get; set; }
    }
}