using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Interfaces;

namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableListItem : ISelectableItem
    {
        private readonly ISelectableListService _selectableListService;

        public SelectableListItem(ISelectableListService selectableListService)
        {
            _selectableListService = selectableListService;
        }

        public SelectableItemType Type =>
            SelectableItemType.List;

        public async Task<SelectableListItemInfo> GetItemInfo(SelectableItemRequest selectableItemRequest)
        {
            var selectableListId = 
                selectableItemRequest.SelectableListId;

            if(selectableListId == null)
                throw new ArgumentNullException(nameof(selectableListId));

            var selectableList = await _selectableListService
                .GetById(selectableListId.Value);

            var defaultListValue = selectableList
                .SelectableListValues.First(v => v.IsDefault);

            return new SelectableListItemInfo
            {
                Metadata = selectableListId.ToString(),
                Label = selectableList.Title.ToLowerInvariant(),
                InitialValue = defaultListValue.Value
            };
        }
    }
}
