using System;

namespace Medico.Application.ViewModels
{
    public class DateRangeDxOptionsViewModel : CompanyDxOptionsViewModel
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
