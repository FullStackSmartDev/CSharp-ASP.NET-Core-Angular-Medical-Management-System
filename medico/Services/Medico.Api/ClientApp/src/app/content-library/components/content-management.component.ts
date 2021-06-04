import { Component } from "@angular/core";

@Component({
    selector: "content-management",
    templateUrl: "content-management.component.html",
    styleUrls: ["content-management.component.sass"]
})
export class ContentManagementComponent {
    libraryItemNames: Array<string> = [
        "templateType",
        "template",
        "selectableListCategory",
        "selectableList",
        "document",
        "expression",
    ];

    currentlyOpenedLibraryItem: string = this.libraryItemNames[0];

    libraryItemsTree: Array<any> = [
        {
            text: "Template Types",
            name: this.libraryItemNames[0],
        },
        {
            text: "Templates",
            name: this.libraryItemNames[1],
        },
        {
            text: "Selectable List Categories",
            name: this.libraryItemNames[2]
        },
        {
            text: "Selectable Lists",
            name: this.libraryItemNames[3]
        },
        {
            text: "Patient Chart Documents",
            name: this.libraryItemNames[4]
        },
        {
            text: "Expressions",
            name: this.libraryItemNames[5]
        }
    ];

    isLibraryItemOpened(adminSectionName: string): boolean {
        return adminSectionName === this.currentlyOpenedLibraryItem;
    }

    selectLibraryItem($event) {
        const libraryItemName = $event.itemData.name;
        this.currentlyOpenedLibraryItem = libraryItemName;
    }
}