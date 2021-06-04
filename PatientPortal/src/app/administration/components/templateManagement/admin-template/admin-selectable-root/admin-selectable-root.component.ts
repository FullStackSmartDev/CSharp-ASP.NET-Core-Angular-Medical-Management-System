import { Component, Input, ViewChild, EventEmitter, Output } from "@angular/core";
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { AdminSelectableListComponent } from '../admin-selectable-list/admin-selectable-list.component';
import { AdminSelectableRangeComponent } from '../admin-selectable-range/admin-selectable-range.component';
import { AdminSelectableDateComponent } from '../admin-selectable-date/admin-selectable-date.component';

@Component({
    selector: "admin-selectable-root",
    templateUrl: "./admin-selectable-root.component.html"
})
export class AdminSelectableRootComponent {
    _adminSelectableComponents: Array<IAdminSelectableComponent>;

    @ViewChild("selectableList", { static: false }) selectableList: AdminSelectableListComponent;
    @ViewChild("selectableRange", { static: false }) selectableRange: AdminSelectableRangeComponent;
    @ViewChild("selectableDate", { static: false }) selectableDate: AdminSelectableDateComponent;

    @Input("companyId") companyId: string;

    @Output("onSelectableItemValueGenerated") onSelectableItemValueGenerated: EventEmitter<string>
        = new EventEmitter();

    constructor(private selectableItemHtmlService: SelectableItemHtmlService) { }

    ngAfterViewInit(): void {
        this._adminSelectableComponents = [
            this.selectableList,
            this.selectableDate,
            this.selectableRange
        ];
    }

    onSelectableHtmlElementGenerated(htmlString: string) {
        this.onSelectableItemValueGenerated.next(htmlString);
    }

    getElementIdsWithIncorrectMetadataCode(htmlContent: string): Array<string> {
        const metacodeRegexps = this._adminSelectableComponents
            .map(s => s.selectableComponent.metadataCodeRegexp);
        return this.selectableItemHtmlService
            .getSelectableItems(htmlContent, metacodeRegexps,
                selectableItem => selectableItem.id,
                selectableItem => {
                    return !selectableItem.value.match(selectableItem.metadata)
                });
    }
}