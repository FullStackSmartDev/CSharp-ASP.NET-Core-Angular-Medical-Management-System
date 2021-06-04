using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medico.Application.Interfaces
{
    public interface ITemplateSelectableListService
    {
        Task AddToCompanyFromLibrary(IDictionary<Guid, Guid> templatesMap, IDictionary<Guid, Guid> selectableListsMap);
    }
}
