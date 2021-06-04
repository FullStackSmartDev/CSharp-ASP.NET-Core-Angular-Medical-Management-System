namespace Medico.Application.Services.PatientChart
{
    public class PatientChartNodeAttributes
    {
        public int Order { get; set; }

        public bool IsActive { get; set; }

        public bool IsPredefined { get; set; }

        public bool IsNotShownInReport { get; set; }

        public bool SignedOffOnly { get; set; }

        public NodeSpecificAttributes NodeSpecificAttributes { get; set; }
    }
}