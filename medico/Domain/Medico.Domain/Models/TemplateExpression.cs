using System;

namespace Medico.Domain.Models
{
    public class TemplateExpression
    {
        public Guid TemplateId { get; set; }

        public Template Template { get; set; }

        public Guid ExpressionId { get; set; }

        public Expression Expression { get; set; }
    }
}