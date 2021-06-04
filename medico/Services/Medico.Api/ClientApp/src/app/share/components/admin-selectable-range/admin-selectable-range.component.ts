import { Component, EventEmitter, Output } from "@angular/core";
import { BaseSelectableRangeComponent } from 'src/app/share/classes/baseSelectableRangeComponent';
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { BaseSelectableComponent } from 'src/app/share/classes/baseSelectableComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { SelectableItemService } from 'src/app/_services/selectable-item.service';
import { SelectableItemRequest } from 'src/app/_models/selectableItemRequest';
import { SelectableItemType } from 'src/app/_models/selectableItemType';

@Component({
    selector: "admin-selectable-range",
    templateUrl: "./admin-selectable-range.component.html"
})
export class AdminSelectableRangeComponent extends BaseSelectableRangeComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    minRangeValue: number = 0;
    maxRangeValue: number = 5;

    constructor(private alertService: AlertService,
        private selectableItemService: SelectableItemService) {
        super();
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    addSelectableItemGeneratedValue() {
        if (this.minRangeValue >= this.maxRangeValue) {
            this.alertService.error("Please, provide the right values.");
            return;
        }

        const selectableItemRequest = new SelectableItemRequest();
        selectableItemRequest.minRangeValue = this.minRangeValue;
        selectableItemRequest.maxRangeValue = this.maxRangeValue;
        selectableItemRequest.type = SelectableItemType.Range;

        this.selectableItemService.getSelectableHtmlElementString(selectableItemRequest)
            .then((selectableItemHtmlElementString) => {
                this.onSelectableHtmlElementGenerated.next(selectableItemHtmlElementString);
                this.resetRangeValuesToDefault();
            })
            .catch(error => {
                this.resetRangeValuesToDefault();
                this.alertService.error(error.message ? error.message : error)
            });
    }

    private resetRangeValuesToDefault() {
        this.minRangeValue = 0;
        this.maxRangeValue = 5;
    }
}