namespace Medico.Domain.Models
{
    public class LocationRoom : Entity
    {
        public string Name { get; set; }

        public string Location { get; set; }

        public bool IsActive { get; set; }
    }
}