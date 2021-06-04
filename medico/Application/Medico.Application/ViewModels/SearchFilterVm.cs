using System;

namespace Medico.Application.ViewModels
{
    public class SearchFilterVm
    {
        public int Take { get; set; }

        public Guid? CompanyId { get; set; }

        public bool? IsActive { get; set; }

        public string Title { get; set; }
    }
}