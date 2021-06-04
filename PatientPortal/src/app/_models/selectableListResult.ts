export class SelectableListResult {
    values: string[];
    defaultValue: string;
    constructor(values: string[] = [], defaultValue: string = "") {
        this.values = values;
        this.defaultValue = defaultValue;
    }
}