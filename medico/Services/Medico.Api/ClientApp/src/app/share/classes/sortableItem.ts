export class SortableItem {
    id: string;
    order: number;
    title: string;

    static createSortableItem(id: string, order: number, title: string): SortableItem {
        const sortableItem = new SortableItem();

        sortableItem.id = id;
        sortableItem.order = order;
        sortableItem.title = title;

        return sortableItem;
    }
}