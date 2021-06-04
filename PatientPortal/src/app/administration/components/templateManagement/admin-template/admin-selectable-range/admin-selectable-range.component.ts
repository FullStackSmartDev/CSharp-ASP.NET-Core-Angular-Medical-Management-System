import { Component, Input, EventEmitter, Output } from "@angular/core";
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { BaseSelectableRangeComponent } from 'src/app/share/classes/baseSelectableRangeComponent';
import { IAdminSelectableComponent } from 'src/app/administration/interfaces/iAdminSelectableComponent';
import { BaseSelectableComponent } from 'src/app/share/classes/baseSelectableComponent';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    selector: "admin-selectable-range",
    templateUrl: "./admin-selectable-range.component.html"
})
export class AdminSelectableRangeComponent extends BaseSelectableRangeComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    minRangeValue: number = 1;
    maxRangeValue: number = 2;

    constructor(selectableItemHtmlService: SelectableItemHtmlService,
        private alertService: AlertService) {
        super(selectableItemHtmlService);
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    addSelectableItemGeneratedValue() {
        if (this.minRangeValue >= this.maxRangeValue) {
            this.alertService.error("Please, provide the right values.");
            return;
        }

        const selectableItemElement
            = this.getHtmlElementString({
                minRangeValue: this.minRangeValue,
                maxRangeValue: this.maxRangeValue,
            });

        this.onSelectableHtmlElementGenerated.next(selectableItemElement);
        this.resetRangeValuesToDefault();
    }

    private resetRangeValuesToDefault() {
        this.maxRangeValue = 2;
        this.minRangeValue = 1;
    }
}