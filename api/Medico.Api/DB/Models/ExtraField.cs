using Medico.Api.DB.Enums;

namespace Medico.Api.DB.Models
{
    public class ExtraField : BaseActiveEntity
    {   
        public string RelatedEntityName { get; set; }

        public ExtraFieldType Type { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public bool? ShowInList { get; set; }

    }
}