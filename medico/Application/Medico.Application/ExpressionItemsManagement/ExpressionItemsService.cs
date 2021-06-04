using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Medico.Application.Interfaces;

namespace Medico.Application.ExpressionItemsManagement
{
    public class ExpressionItemsService : IExpressionItemsService
    {
        private const string ExpressionIdAttrName = "expr-id";
        private const string IdAttrName = "id";
        private const string ExpressionItemTagName = "label";

        private const string DetailedContentContainerId = "detailed-content-container";

        private readonly string _htmlDocumentFormat =
            $@"<!doctype html>
                <html>
                    <body>
                        <div id=""{DetailedContentContainerId}"">{{0}}</div>
                    </body>
                </html>";

        private readonly IExpressionService _expressionService;

        public ExpressionItemsService(IExpressionService expressionService)
        {
            _expressionService = expressionService;
        }

        public async Task<string> GetExpressionItemHtmlElement(Guid expressionId)
        {
            var expression = await _expressionService.GetById(expressionId);
            if (expression == null)
                throw new InvalidOperationException("Expression cannot be found");

            return
                $"<{ExpressionItemTagName} {ExpressionIdAttrName}='{expressionId}' {IdAttrName}='{Guid.NewGuid()}' contenteditable='false'>expr: {expression.Title}</{ExpressionItemTagName}>";
        }

        public IEnumerable<Guid> GetExpressionIdsFromHtmlContent(string htmlContent)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, htmlContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var selectableHtmlElementQuerySelector =
                $@"//{ExpressionItemTagName}[@{ExpressionIdAttrName}]";

            var expressionNodes = rootDocument.DocumentNode.SelectNodes(selectableHtmlElementQuerySelector);
            if (expressionNodes == null || !expressionNodes.Any())
                return Enumerable.Empty<Guid>();

            return expressionNodes.Select(e => e.Attributes.Single(a => a.Name == ExpressionIdAttrName).Value)
                .Distinct()
                .Select(Guid.Parse);
        }

        public string ReplaceExpressionIds(string htmlContent, IDictionary<Guid, Guid> expressionsMap)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, htmlContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var expressionQuerySelector =
                $@"//{ExpressionItemTagName}[@{ExpressionIdAttrName}]";

            var expressionNodes =
                rootDocument.DocumentNode.SelectNodes(expressionQuerySelector);

            if (expressionNodes == null || !expressionNodes.Any())
                return htmlContent;

            foreach (var expressionNode in expressionNodes)
            {
                var exprIdAttrValue =
                    expressionNode.Attributes
                        .Single(a => a.Name == ExpressionIdAttrName).Value;

                var expressionId = Guid.Parse(exprIdAttrValue);

                expressionNode.SetAttributeValue(ExpressionIdAttrName, expressionsMap[expressionId].ToString());
            }

            return rootDocument.DocumentNode.SelectNodes($"//div[@id='{DetailedContentContainerId}']")[0].InnerHtml;
        }

        public IDictionary<Guid, Guid> GeIdToExpressionIdDictionaryFromHtmlContent(string detailedTemplateContent)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, detailedTemplateContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var selectableHtmlElementQuerySelector =
                $@"//{ExpressionItemTagName}[@{ExpressionIdAttrName}]";

            var expressionNodes = rootDocument.DocumentNode.SelectNodes(selectableHtmlElementQuerySelector);

            var idToExpressionIdDictionary = new Dictionary<Guid, Guid>();

            if (expressionNodes == null || !expressionNodes.Any())
                return idToExpressionIdDictionary;

            foreach (var expressionNode in expressionNodes)
            {
                var exprIdAttrValue =
                    expressionNode.Attributes
                        .Single(a => a.Name == ExpressionIdAttrName).Value;

                var elementIdAttrValue =
                    expressionNode.Attributes
                        .Single(a => a.Name == IdAttrName).Value;

                var expressionId = Guid.Parse(exprIdAttrValue);
                var elementId = Guid.Parse(elementIdAttrValue);

                idToExpressionIdDictionary.Add(elementId, expressionId);
            }

            return idToExpressionIdDictionary;
        }

        public string UpdateExpressionItems(Dictionary<Guid, string> elementIdToExpressionResultDictionary,
            string htmlContent)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, htmlContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            foreach (var elementIdPerExpressionResult in elementIdToExpressionResultDictionary)
            {
                var expressionElement = rootDocument.GetElementbyId(elementIdPerExpressionResult.Key.ToString());
                expressionElement.InnerHtml = elementIdPerExpressionResult.Value;
            }

            return rootDocument.DocumentNode.SelectNodes($"//div[@id='{DetailedContentContainerId}']")[0].InnerHtml;
        }
    }
}