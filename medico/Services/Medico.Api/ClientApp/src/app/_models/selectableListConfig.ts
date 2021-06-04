export class SelectableListConfig {
    companyId: string;
    librarySelectableListId: string;
    name: string;
    includeNotSetValue: boolean;

    constructor(companyId: string, name: string, librarySelectableListId: string, includeNotSetValue: boolean = false) {
        this.companyId = companyId;
        this.name = name;
        this.includeNotSetValue = includeNotSetValue;
        this.librarySelectableListId = librarySelectableListId;
    }
}