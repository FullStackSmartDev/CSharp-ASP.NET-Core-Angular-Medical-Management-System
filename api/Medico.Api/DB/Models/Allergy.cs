namespace Medico.Api.DB.Models
{
  public class Allergy : BaseMedicalHistory
  {
    public string Reaction { get; set; }

    public string Medication { get; set; }

  }
}
