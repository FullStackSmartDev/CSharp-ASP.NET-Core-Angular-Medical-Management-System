import { SelectableListValue } from './selectableListValue';

export class SelectableList {
    id: string;
    companyId: string;
    title: string;
    selectableListValues: SelectableListValue[];
    isActive: boolean;
    categoryId: string;
    isPredefined: boolean;
    version: number | null;
    librarySelectableListId: string;

    constructor() {
        this.isActive = true;
        this.selectableListValues = [];  
    }
}