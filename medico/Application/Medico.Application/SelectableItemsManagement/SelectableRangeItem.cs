using System;
using System.Threading.Tasks;

namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableRangeItem : ISelectableItem
    {
        private const string LabelFormat = "{0} --- {1}";
        private const string MetadataFormat = "{0}::{1}";

        public SelectableItemType Type =>
            SelectableItemType.Range;

        public Task<SelectableListItemInfo> GetItemInfo(SelectableItemRequest selectableItemRequest)
        {
            var minValue = selectableItemRequest.MinRangeValue;
            var maxValue = selectableItemRequest.MaxRangeValue;

            if(minValue == null)
                throw new ArgumentNullException(nameof(minValue));

            if (maxValue == null)
                throw new ArgumentNullException(nameof(maxValue));

            return Task.FromResult(new SelectableListItemInfo
            {
                Metadata = string.Format(MetadataFormat, minValue, maxValue),
                InitialValue = minValue.ToString(),
                Label = string.Format(LabelFormat, minValue, maxValue)
            });
        }
    }
}