namespace Medico.Api.DB.Models
{
    public abstract class BaseCode : BaseEntity
    {
        public string Code { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }

    public class CptCode : BaseCode
    {
    }
}
