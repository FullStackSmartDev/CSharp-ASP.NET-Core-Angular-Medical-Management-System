namespace Medico.Application.SelectableItemsManagement
{
    public enum SelectableItemType
    {
        List = 1,
        Range,
        Date,
        Variable
    }

    public static class SelectableItemTypeExtensions
    {
        public static string GetSelectableItemTypeName(this SelectableItemType selectableItemType)
        {
            return selectableItemType.ToString()
                .ToLowerInvariant();
        }
    }
}