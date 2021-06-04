import { Component, EventEmitter, Output } from "@angular/core";
import { IAdminSelectableComponent } from "src/app/administration/interfaces/iAdminSelectableComponent";
import { BaseSelectableComponent } from "src/app/share/classes/baseSelectableComponent";
import { AlertService } from "src/app/_services/alert.service";
import { SelectableItemService } from "src/app/_services/selectable-item.service";
import { SelectableItemRequest } from "src/app/_models/selectableItemRequest";
import { SelectableItemType } from "src/app/_models/selectableItemType";
import { BaseSelectableVariableComponent } from '../../classes/baseSelectableVariableComponent';
import { SelectableVariableType } from 'src/app/_models/selectableVariableType';

@Component({
    selector: "admin-selectable-variable",
    templateUrl: "./admin-selectable-variable.component.html"
})
export class AdminSelectableVariableComponent extends BaseSelectableVariableComponent implements IAdminSelectableComponent {
    @Output() onSelectableHtmlElementGenerated: EventEmitter<string>
        = new EventEmitter();

    variableName: string;
    variableType: SelectableVariableType;
    variableInitialValue: any;

    selectableVariableTypes = [
        { name: "Text", value: 1 },
        { name: "Numeric", value: 2 }
    ];

    constructor(private alertService: AlertService,
        private selectableItemService: SelectableItemService) {
        super();

        this.init();
    }

    get isTextVariableSelected(): boolean {
        return this.variableType === SelectableVariableType.Text;
    }

    get isNumericVariableSelected(): boolean {
        return this.variableType === SelectableVariableType.Numeric;
    }

    get selectableComponent(): BaseSelectableComponent {
        return this;
    }

    resetPreviousInitialValue($event) {
        const newVariableType = $event.value;
        if (newVariableType === SelectableVariableType.Text) {
            this.variableInitialValue = "";
            return;
        }

        this.variableInitialValue = 0;
    }

    addSelectableItemGeneratedValue() {
        if (!this.variableName || !this.selectableType || !this.variableInitialValue) {
            this.alertService.warning("Please, fill out the all variable");
            return;
        }

        const selectableItemRequest = new SelectableItemRequest();
        selectableItemRequest.variableName = this.variableName;
        selectableItemRequest.variableType = this.variableType;
        selectableItemRequest.variableInitialValue = this.variableInitialValue;
        selectableItemRequest.type = SelectableItemType.Variable;

        this.selectableItemService.getSelectableHtmlElementString(selectableItemRequest)
            .then((selectableItemHtmlElementString) => {
                this.onSelectableHtmlElementGenerated.next(selectableItemHtmlElementString);
                this.init();
            })
            .catch(error => {
                this.init();
                this.alertService.error(error.message ? error.message : error)
            });
    }

    private init() {
        this.variableName = "";
        this.variableType = SelectableVariableType.Text;
        this.variableInitialValue = "";
    }
}