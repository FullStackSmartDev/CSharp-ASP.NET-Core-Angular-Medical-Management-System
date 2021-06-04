import { Component, Input, EventEmitter, Output } from "@angular/core";
import { BaseSelectableDateComponent } from 'src/app/share/classes/baseSelectableDateComponent';
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { BaseSelectableComponent } from 'src/app/share/classes/baseSelectableComponent';

@Component({
    selector: "admin-selectable-date",
    templateUrl: "./admin-selectable-date.component.html"
})
export class AdminSelectableDateComponent extends BaseSelectableDateComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    selectedDateFormatId: number =
        this.dateFormats[0].id;

    constructor(selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    addSelectableItemGeneratedValue() {
        const self = this;
        const selectedFormat = this.dateFormats
            .filter(df => df.id === self.selectedDateFormatId)[0].format;

        const selectableHtmlElementString =
            this.getHtmlElementString(selectedFormat);

        this.onSelectableHtmlElementGenerated.next(selectableHtmlElementString);
        this.resetRangeValuesToDefault();
    }

    private resetRangeValuesToDefault() {
        this.selectedDateFormatId = 1;
    }

}