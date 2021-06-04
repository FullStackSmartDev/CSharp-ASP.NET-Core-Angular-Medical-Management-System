import { Component, Input, ViewChild, EventEmitter, Output } from "@angular/core";
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { AdminSelectableListComponent } from '../admin-selectable-list/admin-selectable-list.component';
import { AdminSelectableRangeComponent } from '../admin-selectable-range/admin-selectable-range.component';
import { AdminSelectableDateComponent } from '../admin-selectable-date/admin-selectable-date.component';
import { AdminSelectableVariableComponent } from '../admin-selectable-variable/admin-selectable-variable.component';

@Component({
    selector: "admin-selectable-root",
    templateUrl: "./admin-selectable-root.component.html"
})
export class AdminSelectableRootComponent {
    _adminSelectableComponents: Array<IAdminSelectableComponent>;

    @ViewChild("selectableList", { static: false }) selectableList: AdminSelectableListComponent;
    @ViewChild("selectableRange", { static: false }) selectableRange: AdminSelectableRangeComponent;
    @ViewChild("selectableDate", { static: false }) selectableDate: AdminSelectableDateComponent;
    @ViewChild("selectableVariable", { static: false }) selectableVariable: AdminSelectableVariableComponent;

    @Input("companyId") companyId: string;

    @Output("onSelectableItemValueGenerated") onSelectableItemValueGenerated: EventEmitter<string>
        = new EventEmitter();

    constructor() { }

    ngAfterViewInit(): void {
        this._adminSelectableComponents = [
            this.selectableList,
            this.selectableDate,
            this.selectableRange,
            this.selectableVariable
        ];
    }

    onSelectableHtmlElementGenerated(htmlString: string) {
        this.onSelectableItemValueGenerated.next(htmlString);
    }
}