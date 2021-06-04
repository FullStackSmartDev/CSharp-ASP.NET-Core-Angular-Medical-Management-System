using System;
using System.Collections.Generic;

namespace Medico.Application.Interfaces
{
    public interface ITemplateContentService
    {
        string SetDefaultValuesForSelectableHtmlElements(string detailedTemplateContent,
            out IList<Guid> selectableListsIds);
    }
}
