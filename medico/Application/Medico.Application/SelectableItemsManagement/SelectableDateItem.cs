using System;
using System.Threading.Tasks;

namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableDateItem : ISelectableItem
    {
        public SelectableItemType Type => SelectableItemType.Date;

        public Task<SelectableListItemInfo> GetItemInfo(SelectableItemRequest selectableItemRequest)
        {
            var dateFormat = selectableItemRequest.DateFormat;
            if(string.IsNullOrEmpty(dateFormat))
                throw new ArgumentException(nameof(dateFormat));

            var date = DateTime.Now.ToString(dateFormat);
            
            return Task.FromResult(new SelectableListItemInfo
            {
                Metadata = dateFormat,
                InitialValue = date,
                Label = date
            });
        }
    }
}
