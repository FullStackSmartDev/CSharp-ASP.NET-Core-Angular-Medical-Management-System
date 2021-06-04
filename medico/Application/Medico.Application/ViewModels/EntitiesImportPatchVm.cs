using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels
{
    public class EntitiesImportPatchVm
    {
        public Guid CompanyId { get; set; }

        public EntitiesImportPatchVm()
        {
            LibraryEntityIds = new List<Guid>();
        }

        public List<Guid> LibraryEntityIds { get; set; }
    }
}