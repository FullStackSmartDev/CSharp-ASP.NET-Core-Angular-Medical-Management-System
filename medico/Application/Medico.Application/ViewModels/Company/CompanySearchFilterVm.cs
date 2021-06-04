using System;

namespace Medico.Application.ViewModels.Company
{
    public class CompanySearchFilterVm : SearchFilterVm
    {
        public Guid? AppointmentId { get; set; }
    }
}
