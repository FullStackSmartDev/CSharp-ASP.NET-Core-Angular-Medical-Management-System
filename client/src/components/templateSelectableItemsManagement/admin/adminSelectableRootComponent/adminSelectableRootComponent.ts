import { Component, Output, EventEmitter, ViewChild, AfterViewInit } from "@angular/core"
import { AdminSelectableListComponent, IAdminSelectableComponent } from "../adminSelectableListComponent/adminSelectableListComponent";
import { AdminSelectableRangeComponent } from "../adminSelectableRangeComponent/adminSelectableRangeComponent";
import { AdminSelectableDateComponent } from "../adminSelectableDateComponent/adminSelectableDateComponent";
import { SelectableItemHtmlService } from "../../../../provider/selectableItemHtmlService";

@Component({
    templateUrl: 'adminSelectableRootComponent.html',
    selector: 'admin-selectable-root'
})
export class AdminSelectableRootComponent implements AfterViewInit {
    _adminSelectableComponents: Array<IAdminSelectableComponent>;

    @ViewChild("selectableList") selectableList: AdminSelectableListComponent;
    @ViewChild("selectableRange") selectableRange: AdminSelectableRangeComponent;
    @ViewChild("selectableDate") selectableDate: AdminSelectableDateComponent;

    @Output("onSelectableItemValueGenerated") onSelectableItemValueGenerated: EventEmitter<string>
        = new EventEmitter();

    constructor(private selectableItemHtmlService: SelectableItemHtmlService){}

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