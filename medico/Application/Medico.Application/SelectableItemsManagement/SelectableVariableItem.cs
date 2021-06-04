using System;
using System.Threading.Tasks;

namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableVariableItem : ISelectableItem
    {
        private const string LabelFormat = "var: {0}";
        private const string MetadataFormat = "{0}{1}{2}";
        private const string Separator = "::";
        
        public SelectableItemType Type =>
            SelectableItemType.Variable;

        public Task<SelectableListItemInfo> GetItemInfo(SelectableItemRequest selectableItemRequest)
        {
            var selectableVariableName = selectableItemRequest.VariableName;
            
            var selectableVariableType = 
                selectableItemRequest.VariableType;
            
            if(!selectableVariableType.HasValue)
                throw new NullReferenceException(nameof(selectableVariableType));
            
            return Task.FromResult(new SelectableListItemInfo
            {
                Metadata = string.Format(MetadataFormat, selectableVariableName, Separator, (int)selectableVariableType.Value),
                InitialValue = selectableItemRequest.VariableInitialValue,
                Label = string.Format(LabelFormat, selectableVariableName)
            });
        }

        public static SelectableVariableMetadata ParseMetadataString(string metadataString)
        {
            var metadata = 
                metadataString.Split(Separator);

            var variableName = metadata[0];
            
            var variableTypeString = metadata[1];
            var variableType = (SelectableVariableType) Convert.ToInt32(variableTypeString);

            return new SelectableVariableMetadata
            {
                VariableName = variableName,
                VariableType = variableType
            };
        }
    }
}