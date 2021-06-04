using System;

namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableItemRequest
    {
        public SelectableItemType Type { get; set; }

        public Guid? SelectableListId { get; set; }

        public double? MinRangeValue { get; set; }

        public double? MaxRangeValue { get; set; }

        public string DateFormat { get; set; }

        public string VariableName { get; set; }

        public SelectableVariableType? VariableType { get; set; }

        public string VariableInitialValue { get; set; }
    }
}