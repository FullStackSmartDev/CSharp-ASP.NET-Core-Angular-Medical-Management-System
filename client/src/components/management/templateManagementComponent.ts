import { Component } from '@angular/core';

@Component({
  templateUrl: 'templateManagementComponent.html',
  selector: 'template-management'
})
export class TemplateManagementComponent {

  public tabs: Array<any> = [];
  public selectedTabIndex: number = 0;

  constructor() {
    this.initTabs();
  }

  initTabs(): any {
    this.tabs = [
      {
        id: 0,
        text: "Selectable Item Categories"
      },
      {
        id: 1,
        text: "Selectable Item"
      },
      {
        id: 2,
        text: "Template Type"
      },
      {
        id: 3,
        text: "Template"
      },
      {
        id: 4,
        text: "Template Mapping"
      },
      {
        id: 5,
        text: "Keyword ICD Code Map"
      }
    ];
  }

  onTabSelect($event) {
    if (this.selectedTabIndex !== $event.itemIndex)
      this.selectedTabIndex = $event.itemIndex
  }

  isTabVisible(tabId: number) {
    return this.selectedTabIndex === tabId;
  }
}