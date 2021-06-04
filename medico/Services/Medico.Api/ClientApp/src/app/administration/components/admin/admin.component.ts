import { Component } from '@angular/core';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent {
    adminSectionNames: Array<string> = [
        "companyManagement",
        "templateManagement",
        "medicationManagement",
        "patientChartManagement",
        "expressionsManagement"
        //"attributeManagement"
    ]

    currentlyOpenedAdminSection: string = this.adminSectionNames[0];

    adminModelTree: Array<any> = [
        {
            text: "Company Management",
            name: this.adminSectionNames[0],
            isSelected: true
        },
        {
            text: "Template Management",
            name: this.adminSectionNames[1]
        },
        {
            text: "Medication Management",
            name: this.adminSectionNames[2]
        },
        {
            text: "Patient Chart Management",
            name: this.adminSectionNames[3]
        },
        {
            text: "Expressions Management",
            name: this.adminSectionNames[4]
        }
        // {
        //     text: "Attributes Management",
        //     name: this.adminSectionNames[5]
        // }
    ];

    isAdminSectionOpened(adminSectionName: string): boolean {
        return adminSectionName === this.currentlyOpenedAdminSection;
    }

    selectAdminSection($event) {
        if (!$event || !$event.itemData || !$event.itemData.name) {
            return;
        }

        const adminSectionName = $event.itemData.name;
        this.currentlyOpenedAdminSection = adminSectionName;
    }
}