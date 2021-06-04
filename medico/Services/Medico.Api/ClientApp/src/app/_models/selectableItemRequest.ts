import { SelectableItemType } from './selectableItemType';
import { SelectableVariableType } from './selectableVariableType';

export class SelectableItemRequest {
    type: SelectableItemType;
    selectableListId: string | null;
    minRangeValue: number | null;
    maxRangeValue: number | null;
    dateFormat: string | null;
    variableName: string | null;
    variableType: SelectableVariableType | null;
    variableInitialValue: string | null;

    toQueryParams(): any {
        const queryParams = {};
        const entityFilterFields = Object.keys(this);

        if (!entityFilterFields.length)
            return queryParams;

        for (let i = 0; i < entityFilterFields.length; i++) {
            const entityFilterField = entityFilterFields[i];
            queryParams[entityFilterField] = this[entityFilterField];
        }

        return queryParams;
    }
}