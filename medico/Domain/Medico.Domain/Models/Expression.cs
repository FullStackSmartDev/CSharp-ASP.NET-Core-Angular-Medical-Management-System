using System;
using System.Collections.Generic;

namespace Medico.Domain.Models
{
    public class Expression : Entity
    {
        public Guid? LibraryExpressionId { get; set; }

        public Expression LibraryExpression { get; set; }

        public int? Version { get; set; }

        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string Title { get; set; }

        public string Template { get; set; }

        public List<Expression> LibraryExpressions { get; set; }
        
        public List<ExpressionReferenceTable> ExpressionReferenceTables { get; set; }

        public List<TemplateExpression> ExpressionTemplates { get; set; }
    }
}