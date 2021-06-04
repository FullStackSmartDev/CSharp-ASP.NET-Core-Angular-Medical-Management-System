import { Component } from '@angular/core';
@Component({
    selector: 'administration',
    templateUrl: 'administration.html'
})
export class AdministrationPage {
    adminSectionNames: Array<string> = [
        "companyManagement",
        "templateManagement"
        //"attributeManagement"
    ]

    currentlyOpenedAdminSection: string =
        this.adminSectionNames[0];

    administrationModelTree: Array<any> = [
        {
            text: "Company Management",
            name: this.adminSectionNames[0],
            isSelected: true
        },
        {
            text: "Template Management",
            name: this.adminSectionNames[1]
        }
        // {
        //     text: "Attributes Management",
        //     name: this.adminSectionNames[2]
        // }
    ];

    isAdminSectionOpened(adminSectionName: string): boolean {
        return adminSectionName === this.currentlyOpenedAdminSection;
    }

    selectAdministrationSection($event) {
        if(!$event || !$event.itemData || !$event.itemData.name){
            return;
        }
        const adminSectionName = $event.itemData.name;
        this.currentlyOpenedAdminSection = adminSectionName;
    }
}