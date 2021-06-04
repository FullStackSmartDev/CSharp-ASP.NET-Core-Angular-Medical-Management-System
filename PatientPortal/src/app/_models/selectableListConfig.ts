export class SelectableListConfig {
    companyId: string;
    name: string;
    includeNotSetValue: boolean;

    constructor(companyId: string, name: string, includeNotSetValue: boolean = false) {
        this.companyId = companyId;
        this.name = name;
        this.includeNotSetValue = includeNotSetValue;
    }
}