using System;

namespace Medico.Api.DB.Models
{
    public abstract class BaseEntity
    {
        public bool? IsDelete { get; set; }

        public Guid Id { get; set; }
    }

    public abstract class CompanyRelatedEntity : BaseEntity
    {
        public Guid CompanyId { get; set; }

        public Company Company { get; set; }
    }

    public abstract class BaseActiveEntity
    {
        public bool? IsActive { get; set; }

        public Guid Id { get; set; }
    }
}
