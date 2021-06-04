using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class BaseVitalSignsViewModel : BaseViewModel
    {
        [Required]
        public Guid PatientId { get; set; }

        public string DominantHand { get; set; }

        public double? Weight { get; set; }

        public double? Height { get; set; }

        public double? LeftBicep { get; set; }

        public double? RightBicep { get; set; }

        public double? LeftForearm { get; set; }

        public double? RightForearm { get; set; }

        public double? LeftThigh { get; set; }

        public double? RightThigh { get; set; }

        public double? LeftCalf { get; set; }

        public double? RightCalf { get; set; }

        public string OxygenUse { get; set; }

        public double? OxygenAmount { get; set; }

        public double? HeadCircumference { get; set; }
    }
}