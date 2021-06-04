import { Output, EventEmitter, Component } from '@angular/core';
import { BaseSelectableDateComponent } from '../../base/baseSelectableDateComponent';
import { SelectableItemHtmlService } from '../../../../provider/selectableItemHtmlService';
import { IAdminSelectableComponent } from '../adminSelectableListComponent/adminSelectableListComponent';
import { BaseSelectableComponent } from '../../base/baseSelectableComponent';

@Component({
    templateUrl: 'adminSelectableDateComponent.html',
    selector: 'admin-selectable-date'
})

export class AdminSelectableDateComponent extends BaseSelectableDateComponent implements
    IAdminSelectableComponent {
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