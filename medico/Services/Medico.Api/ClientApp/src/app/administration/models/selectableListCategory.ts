export class SelectableListCategory {
    id: string;
    companyId: string;
    title: string;
    isActive: boolean;
    version: number | null;
    librarySelectableListCategoryId: string | null;

    constructor() {
        this.isActive = true;
    }
}