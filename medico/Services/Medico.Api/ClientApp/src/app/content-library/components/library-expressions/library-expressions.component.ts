import { Component } from '@angular/core';

@Component({
    selector: "library-expressions",
    templateUrl: "library-expressions.component.html",
})
export class LibraryExpressionsComponent {
    expressionManagementTabs: Array<any> = [];
    selectedTabIndex: number = 0;

    constructor() {
        this.initCompanyManagementTabs();
    }

    onTabSelect($event) {
        if (this.selectedTabIndex !== $event.itemIndex)
            this.selectedTabIndex = $event.itemIndex
    }

    isTabVisible(tabId: number) {
        return this.selectedTabIndex === tabId;
    }

    private initCompanyManagementTabs(): any {
        this.expressionManagementTabs = [
            {
                id: 0,
                text: "Reference tables"
            },
            {
                id: 1,
                text: "Expressions builder"
            }
        ];
    }
}