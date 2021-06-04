using System;
using System.Linq;
using Medico.Application.Services.PatientChart;

namespace Medico.Application.Extensions
{
    public static class PatientChartNodeExtensions
    {
        public static PatientChartNode FirstOrDefault(this PatientChartNode patientChartNode,
            Func<PatientChartNode, bool> predicate)
        {
            if (predicate(patientChartNode))
                return patientChartNode;

            var children = patientChartNode.Children;
            if (children == null || !children.Any())
                return null;

            foreach (var childNode in children)
            {
                var firstOrDefaultChild = childNode.FirstOrDefault(predicate);
                if (firstOrDefaultChild != null)
                    return firstOrDefaultChild;
            }

            return null;
        }
    }
}