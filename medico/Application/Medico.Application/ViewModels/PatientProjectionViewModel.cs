using System;

namespace Medico.Application.ViewModels
{
    public class PatientProjectionViewModel
        : BaseViewModel
    {
        public string Name { get; set; }

        public string Phone { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string Email { get; set; }

        public Guid CompanyId { get; set; }
    }
}
