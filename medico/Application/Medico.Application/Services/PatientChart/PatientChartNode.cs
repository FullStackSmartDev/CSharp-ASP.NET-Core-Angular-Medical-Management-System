using System;
using System.Collections.Generic;

namespace Medico.Application.Services.PatientChart
{
    public class PatientChartNode
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public PatientChartNodeType Type { get; set; }

        public dynamic Value { get; set; }

        public PatientChartNodeAttributes Attributes { get; set; }

        public List<PatientChartNode> Children { get; set; }

        public Guid ParentId { get; set; }

        public string Template { get; set; }
    }
}