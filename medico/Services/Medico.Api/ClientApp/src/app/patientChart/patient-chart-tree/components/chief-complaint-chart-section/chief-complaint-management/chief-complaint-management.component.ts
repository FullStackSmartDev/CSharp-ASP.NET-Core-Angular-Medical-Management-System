import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { DxPopupComponent } from "devextreme-angular";

@Component({
    templateUrl: "chief-complaint-management.component.html",
    selector: "chief-complaint-management"
})

export class ChiefComplaintManagementComponent  {
    @Input("allegations") allegations: string;
    @Input() companyId: string;

    @Output() templatesAdded: EventEmitter<Array<any>> = new EventEmitter();

    @ViewChild("chiefcomplaintManagementPopup", { static: false }) chiefcomplaintManagementPopup: DxPopupComponent;

    selectedTabIndex: number = -1;
    isChiefComplaintsPopupVisible: boolean = false;

    tabs: Array<any> = [
        { id: 0, text: "MAP MISSED KEYWORDS" },
        { id: 1, text: "ALL KEYWORDS" },
        { id: 2, text: "NEW MAP" },
        { id: 3, text: "EXISTING MAP" }
    ]

    onTabSelect($event): void {
        if (this.selectedTabIndex !== $event.itemIndex)
            this.selectedTabIndex = $event.itemIndex
    }

    isTabVisible(tabId: number) {
        return this.selectedTabIndex === tabId;
    }

    onMappedTemplatesAdded($event) {
        this.templatesAdded.next($event);
        this.hide();
    }

    show() {
        this.selectedTabIndex = 0;
        this.chiefcomplaintManagementPopup.instance.show();
    }

    hide() {
        this.selectedTabIndex = -1;
        this.chiefcomplaintManagementPopup.instance.hide();
    }
}
