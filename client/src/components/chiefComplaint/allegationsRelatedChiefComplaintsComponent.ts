import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
  templateUrl: 'allegationsRelatedChiefComplaintsComponent.html',
  selector: 'allegations-related-chief-complaints'
})

export class AllegationsRelatedChiefComplaintsComponent {
  @Input("allegations") allegations: string;

  @Output() onChiefComplaintTemplatesAdded: EventEmitter<Array<any>>
    = new EventEmitter();

  @ViewChild("chiefComplaintKeywordsPopup") chiefComplaintKeywordsPopup: DxPopupComponent;

  selectedTabIndex: number = -1;
  isChiefComplaintsPopupVisible: boolean = false;

  tabs: Array<any> = [
    { id: 0, text: "Matched Kewords" },
    { id: 1, text: "Full Search" },
    { id: 2, text: "New Mapping" }
  ]

  onTabSelect($event): void {
    if (this.selectedTabIndex !== $event.itemIndex)
      this.selectedTabIndex = $event.itemIndex
  }

  isTabVisible(tabId: number) {
    return this.selectedTabIndex === tabId;
  }

  onMappedTemplatesAdded($event) {
    this.onChiefComplaintTemplatesAdded.next($event);
    this.hideRelatedChiefComplaints();
  }

  showRelatedChiefComplaints() {
    this.selectedTabIndex = 0;
    this.chiefComplaintKeywordsPopup
      .instance
      .show();
  }

  hideRelatedChiefComplaints() {
    this.selectedTabIndex = -1;

    this.chiefComplaintKeywordsPopup
      .instance
      .hide();
  }
}
