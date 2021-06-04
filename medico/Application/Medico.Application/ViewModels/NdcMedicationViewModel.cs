namespace Medico.Application.ViewModels
{
    public class NdcMedicationViewModel
    {
        public string NdcCode { get; set; }

        public string MedicationName { get; set; }

        public string DosageForm { get; set; }

        public string Route { get; set; }

        public string Unit { get; set; }

        public string Strength { get; set; }

        public string Classes { get; set; }

        public static NdcMedicationViewModel Empty => new NdcMedicationViewModel();
    }
}