import { Component, EventEmitter, Output } from "@angular/core";
import { BaseSelectableDateComponent } from 'src/app/share/classes/baseSelectableDateComponent';
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { BaseSelectableComponent } from 'src/app/share/classes/baseSelectableComponent';
import { SelectableItemRequest } from 'src/app/_models/selectableItemRequest';
import { SelectableItemType } from 'src/app/_models/selectableItemType';
import { SelectableItemService } from 'src/app/_services/selectable-item.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    selector: "admin-selectable-date",
    templateUrl: "./admin-selectable-date.component.html"
})
export class AdminSelectableDateComponent extends BaseSelectableDateComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    selectedDateFormatId: number =
        this.dateFormats[0].id;

    constructor(private selectableItemService: SelectableItemService,
        private alertService: AlertService) {
        super();
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    addSelectableItemGeneratedValue() {
        const selectedFormat = this.dateFormats
            .filter(df => df.id === this.selectedDateFormatId)[0].format;

        const selectableItemRequest = new SelectableItemRequest();
        selectableItemRequest.dateFormat = selectedFormat;
        selectableItemRequest.type = SelectableItemType.Date;

        this.selectableItemService.getSelectableHtmlElementString(selectableItemRequest)
            .then((selectableItemHtmlElementString) => {
                this.onSelectableHtmlElementGenerated
                    .next(selectableItemHtmlElementString);

                this.resetRangeValuesToDefault();

            })
            .catch(error => {
                this.resetRangeValuesToDefault();
                this.alertService.error(error.message ? error.message : error)
            });
    }

    private resetRangeValuesToDefault() {
        this.selectedDateFormatId = 1;
    }

}