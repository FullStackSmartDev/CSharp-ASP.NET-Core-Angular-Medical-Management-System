using System;

namespace Medico.Api.DB.Models
{
    public class PatientDataModel : BaseEntity
    {   
        public Guid? CompanyId { get; set; }

        public Company Company { get; set; }

        public string JsonPatientDataModel { get; set; }
    }
}
