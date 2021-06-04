using System;

namespace Medico.Application.ViewModels
{
    public class ImportedItemsSearchFilterVm
    {
        public int Take { get; set; }
        
        public bool? ExcludeImported { get; set; }
        
        public Guid? CompanyId { get; set; }
    }
}