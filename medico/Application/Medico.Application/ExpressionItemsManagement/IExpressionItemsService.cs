using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medico.Application.ExpressionItemsManagement
{
    public interface IExpressionItemsService
    {
        Task<string> GetExpressionItemHtmlElement(Guid expressionId);

        IEnumerable<Guid> GetExpressionIdsFromHtmlContent(string htmlContent);

        string ReplaceExpressionIds(string htmlContent, IDictionary<Guid, Guid> expressionsMap);
        
        IDictionary<Guid, Guid> GeIdToExpressionIdDictionaryFromHtmlContent(string detailedTemplateContent);
        
        string UpdateExpressionItems(Dictionary<Guid,string> elementIdToExpressionResultDictionary,
            string htmlContent);
    }
}