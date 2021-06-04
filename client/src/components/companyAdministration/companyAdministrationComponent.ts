import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: 'companyAdministrationComponent.html',
    selector: 'company-administration'
})

export class CompanyAdministrationComponent implements OnInit {
    companyManagementTabs: Array<any> = [];
    selectedTabIndex: number = 0;

    constructor() {
        this.initCompanyManagementTabs();
    }

    ngOnInit(): void {
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