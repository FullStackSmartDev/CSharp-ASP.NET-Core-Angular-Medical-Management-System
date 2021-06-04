using System.Threading.Tasks;

namespace Medico.Application.SelectableItemsManagement
{
    public interface ISelectableItem
    {
        SelectableItemType Type { get; }

        Task<SelectableListItemInfo> GetItemInfo(SelectableItemRequest selectableItemRequest);
    }
}
