namespace Medico.Domain.Models
{
    public class FamilyHistory : BaseMedicalHistory
    {
        public string FamilyMember { get; set; }

        public string FamilyStatus { get; set; }

    }
}