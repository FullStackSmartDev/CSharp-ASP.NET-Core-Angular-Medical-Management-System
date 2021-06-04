export class Phrase {
    id: string;
    companyId: string;
    name: string;
    title: string;
    content: string;
    isActive: boolean;
    contentWithDefaultSelectableItemsValues: string;

    constructor() {
        this.isActive = true;
    }
}