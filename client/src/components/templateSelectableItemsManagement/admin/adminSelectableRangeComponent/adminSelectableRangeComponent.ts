import { Output, EventEmitter, Component } from '@angular/core';
import { ToastService } from '../../../../provider/toastService';
import { SelectableItemHtmlService } from '../../../../provider/selectableItemHtmlService';
import { BaseSelectableRangeComponent } from '../../base/baseSelectableRangeComponent';
import { IAdminSelectableComponent } from '../adminSelectableListComponent/adminSelectableListComponent';
import { BaseSelectableComponent } from '../../base/baseSelectableComponent';

@Component({
    templateUrl: 'adminSelectableRangeComponent.html',
    selector: 'admin-selectable-range'
})

export class AdminSelectableRangeComponent extends BaseSelectableRangeComponent
    implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    minRangeValue: number = 1;
    maxRangeValue: number = 2;

    constructor(selectableItemHtmlService: SelectableItemHtmlService,
        private toastService: ToastService) {
        super(selectableItemHtmlService);
    }

    get selectableComponent(): BaseSelectableComponent{
        return this;
    }

    addSelectableItemGeneratedValue() {
        if (this.minRangeValue >= this.maxRangeValue) {
            this.toastService.showErrorMessage("Please, provide the right values.");
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