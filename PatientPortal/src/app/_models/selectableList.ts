export class SelectableList {
    id: string;
    companyId: string;
    name: string;
    title: string;
    jsonValues: string;
    isActive: boolean;
    categoryId: string;

    constructor() {
        this.isActive = true;
        this.jsonValues = "{\"Values\":[]}";
    }
}

export class CategorySelectableList {
    id: string;
    category: string;
    title: string;
    isActive: boolean;
    categoryName: string;
    selectableListName: string;
}