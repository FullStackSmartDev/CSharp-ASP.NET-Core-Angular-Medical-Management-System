using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medico.Application.SelectableItemsManagement
{
    public interface ISelectableItemsService
    {
        Task<string> GetSelectableItemHtmlElement(SelectableItemRequest selectableItemRequest);

        IEnumerable<Guid> GetSelectableListIdsFromHtmlContent(string htmlContent);

        string ReplaceSelectableListIds(string htmlContent, IDictionary<Guid, Guid> selectableListMap);

        string SetInitialValues(string detailedTemplateContent);

        SelectableVariables GetSelectableVariablesFromHtmlContent(string htmlContent, bool isForTesting = false);
    }
}