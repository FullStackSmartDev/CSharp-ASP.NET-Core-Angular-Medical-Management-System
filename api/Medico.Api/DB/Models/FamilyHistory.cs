using System;

namespace Medico.Api.DB.Models
{
    public class FamilyHistory : BaseMedicalHistory
    {
        public string FamilyMember { get; set; }

        public string FamilyStatus { get; set; }

        //public IcdCode IcdCode { get; set; }
    }
}
