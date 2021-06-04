using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableItemsService : ISelectableItemsService
    {
        private const string SelectableTypeAttrName = "selectable-type";
        private const string InitialValueAttrName = "initial-value";
        private const string MetadataAttrName = "metadata";
        private const string SelectableItemTagName = "label";

        private const string DetailedContentContainerId = "detailed-content-container";

        private readonly string _htmlDocumentFormat =
            $@"<!doctype html>
                <html>
                    <body>
                        <div id=""{DetailedContentContainerId}"">{{0}}</div>
                    </body>
                </html>";

        private readonly string _selectableItemHtmlElementFormat =
            $"<{SelectableItemTagName} contenteditable='false' id='{{0}}' {SelectableTypeAttrName}='{{1}}' {InitialValueAttrName}='{{2}}' {MetadataAttrName}='{{3}}'>{{4}}</{SelectableItemTagName}>";

        private readonly IEnumerable<ISelectableItem> _selectableItems;

        public SelectableItemsService(IEnumerable<ISelectableItem> selectableItems)
        {
            _selectableItems = selectableItems;
        }

        public async Task<string> GetSelectableItemHtmlElement(SelectableItemRequest selectableItemRequest)
        {
            var selectableItemType = selectableItemRequest.Type;

            var selectableItem = _selectableItems.First(i => i.Type == selectableItemType);
            var selectableItemInfo =
                await selectableItem.GetItemInfo(selectableItemRequest);

            return string.Format(_selectableItemHtmlElementFormat,
                Guid.NewGuid(), selectableItemType.GetSelectableItemTypeName(), selectableItemInfo.InitialValue,
                selectableItemInfo.Metadata,
                selectableItemInfo.Label);
        }

        public IEnumerable<Guid> GetSelectableListIdsFromHtmlContent(string htmlContent)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, htmlContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var selectableListType = SelectableItemType
                .List.GetSelectableItemTypeName();

            var selectableHtmlElementQuerySelector =
                $@"//{SelectableItemTagName}[@{SelectableTypeAttrName}='{selectableListType}']";

            var selectableListNodes = rootDocument.DocumentNode.SelectNodes(selectableHtmlElementQuerySelector);
            if (selectableListNodes == null || !selectableListNodes.Any())
                return Enumerable.Empty<Guid>();

            return selectableListNodes.Select(e => e.Attributes.Single(a => a.Name == MetadataAttrName).Value)
                .Distinct()
                .Select(Guid.Parse);
        }

        public string ReplaceSelectableListIds(string htmlContent,
            IDictionary<Guid, Guid> selectableListMap)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, htmlContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var selectableListType = SelectableItemType
                .List.GetSelectableItemTypeName();

            var selectableHtmlElementQuerySelector =
                $@"//{SelectableItemTagName}[@{SelectableTypeAttrName}='{selectableListType}']";

            var selectableListNodes =
                rootDocument.DocumentNode.SelectNodes(selectableHtmlElementQuerySelector);

            if (selectableListNodes == null || !selectableListNodes.Any())
                return htmlContent;

            foreach (var selectableListNode in selectableListNodes)
            {
                var metadataAttrValue =
                    selectableListNode.Attributes.Single(a => a.Name == MetadataAttrName).Value;

                var selectableListId = Guid.Parse(metadataAttrValue);

                selectableListNode.SetAttributeValue(MetadataAttrName, selectableListMap[selectableListId].ToString());
            }

            return rootDocument.DocumentNode.SelectNodes($"//div[@id='{DetailedContentContainerId}']")[0].InnerHtml;
        }

        public string SetInitialValues(string detailedTemplateContent)
        {
            var htmlDocumentString = string.Format(_htmlDocumentFormat, detailedTemplateContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var selectableHtmlElementQuerySelector =
                $@"//{SelectableItemTagName}[@{SelectableTypeAttrName}]";

            var selectableNodes =
                rootDocument.DocumentNode.SelectNodes(selectableHtmlElementQuerySelector);

            if (selectableNodes == null || !selectableNodes.Any())
                return detailedTemplateContent;

            foreach (var selectableNode in selectableNodes)
            {
                var initialAttrValue =
                    selectableNode.Attributes.Single(a => a.Name == InitialValueAttrName).Value;

                selectableNode.InnerHtml = initialAttrValue;
            }

            return rootDocument.DocumentNode.SelectNodes($"//div[@id='{DetailedContentContainerId}']")[0]
                .InnerHtml;
        }

        public SelectableVariables GetSelectableVariablesFromHtmlContent(string htmlContent, bool isForTesting = false)
        {
            if (isForTesting)
                return new SelectableVariables
                {
                    NumericVariables = new Dictionary<string, double>
                    {
                        {"numericVariable", 2.5}
                    },
                    TextVariables = new Dictionary<string, string>
                    {
                        {"textVariable", "test"}
                    }
                };

            var htmlDocumentString = string.Format(_htmlDocumentFormat, htmlContent);

            var rootDocument = new HtmlDocument();
            rootDocument.LoadHtml(htmlDocumentString);

            var selectableVariableType = SelectableItemType
                .Variable.GetSelectableItemTypeName();

            var selectableHtmlElementQuerySelector =
                $@"//{SelectableItemTagName}[@{SelectableTypeAttrName}='{selectableVariableType}']";

            var selectableVariableNodes =
                rootDocument.DocumentNode.SelectNodes(selectableHtmlElementQuerySelector);

            if (selectableVariableNodes == null || !selectableVariableNodes.Any())
                return null;

            var selectableVariables = selectableVariableNodes.Select(selectableVariableNode =>
                {
                    var metadataAttrValue =
                        selectableVariableNode.Attributes.Single(a => a.Name == MetadataAttrName)
                            .Value;

                    var variableMetadata =
                        SelectableVariableItem.ParseMetadataString(metadataAttrValue);

                    var variableValue = selectableVariableNode.InnerHtml;

                    return SelectableVariable.CreateSelectableVariable(variableMetadata.VariableType,
                        variableMetadata.VariableName, variableValue);
                })
                .ToList();

            var groupedByTypeSelectableVariables =
                selectableVariables.GroupBy(v => v.Type)
                    .ToList();

            return new SelectableVariables
            {
                TextVariables = groupedByTypeSelectableVariables.Where(kp => kp.Key == SelectableVariableType.Text)
                    .SelectMany(kp => kp)
                    .ToDictionary(v => v.VariableName, variable => variable.VariableValue),
                NumericVariables = groupedByTypeSelectableVariables
                    .Where(kp => kp.Key == SelectableVariableType.Numeric)
                    .SelectMany(kp => kp)
                    .ToDictionary(v => v.VariableName, variable => Convert.ToDouble(variable.VariableValue))
            };
        }
    }
}