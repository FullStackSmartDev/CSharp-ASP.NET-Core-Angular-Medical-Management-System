import { Component, Input, EventEmitter, Output } from "@angular/core";
import { SortableItem } from '../../classes/sortableItem';

@Component({
    templateUrl: "drag-and-drop-list.component.html",
    selector: "drag-and-drop-list"
})
export class DragAndDropListComponent {
    @Input() listItems: SortableItem[];

    @Output("onOrderChanged") onOrderChanged: EventEmitter<SortableItem[]>
        = new EventEmitter();

    get firstItemInList(): SortableItem {
        return this.listItemsEmpty
            ? null
            : this.listItems[0];
    }

    get listItemsEmpty(): boolean {
        return !this.listItems || !this.listItems.length;
    }

    get isOnlyOneItemInList(): boolean {
        return this.listItems && this.listItems.length === 1;
    }

    get isDragAndDropListShown(): boolean {
        return !this.listItemsEmpty && !this.isOnlyOneItemInList;
    }

    onTemplatesReordered($event) {
        const fromIndex = $event.fromIndex;
        const toIndex = $event.toIndex;

        const increaseOrder = toIndex > fromIndex;

        const shiftNumber = increaseOrder
            ? toIndex - fromIndex
            : fromIndex - toIndex;

        const movedItem = $event.itemData;

        const movedItemOrder = increaseOrder
            ? movedItem.order + shiftNumber
            : movedItem.order - shiftNumber;

        movedItem.order = movedItemOrder;

        if (increaseOrder) {
            this.listItems.forEach(listItem => {
                const isOrderShouldBeChanged =
                    listItem.order < movedItemOrder + 1 &&
                    listItem.id !== movedItem.id &&
                    listItem.order > fromIndex + 1;

                if (isOrderShouldBeChanged)
                    listItem.order = listItem.order - 1;
            });
        }
        else {
            this.listItems.forEach(listItem => {
                const isOrderShouldBeChanged =
                    listItem.order > movedItemOrder - 1 &&
                    listItem.id !== movedItem.id &&
                    listItem.order < fromIndex + 1;

                if (isOrderShouldBeChanged)
                    listItem.order = listItem.order + 1;
            });
        }

        this.onOrderChanged.next(this.listItems);
    }
}