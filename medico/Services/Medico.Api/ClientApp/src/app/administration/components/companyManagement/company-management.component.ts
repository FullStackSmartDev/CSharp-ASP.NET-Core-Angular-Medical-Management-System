import { Component } from "@angular/core";

@Component({
    selector: "company-management",
    templateUrl: "./company-management.component.html"
})
export class CompanyManagementComponent {
    companyManagementTabs: Array<any> = [];
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
        this.companyManagementTabs = [
            {
                id: 0,
                text: "Company Info"
            },
            {
                id: 1,
                text: "Locations"
            },
            {
                id: 2,
                text: "Rooms"
            },
            {
                id: 3,
                text: "Employees"
            },
            {
                id: 4,
                text: "Permissions"
            }
        ];
    }
}