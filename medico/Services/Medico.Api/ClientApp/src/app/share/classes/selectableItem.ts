export class SelectableItem {
    id: string;
    metadata: string;
    value: string;

    constructor(id: string, metadata: string, value: string) {
        this.id = id;
        this.metadata = metadata;
        this.value = value;
    }
}