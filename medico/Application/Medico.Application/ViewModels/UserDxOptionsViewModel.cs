using System;

namespace Medico.Application.ViewModels
{
    public class UserDxOptionsViewModel : CompanyDxOptionsViewModel
    {
        public int EmployeeType { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
