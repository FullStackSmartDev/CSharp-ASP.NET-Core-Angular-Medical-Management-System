export class TemplateType {
    id: string;
    companyId: string;
    name: string;
    title: string;
    isActive: boolean;
    isPredefined: boolean;
    libraryTemplateTypeId: string | null;

    constructor() {
        this.isActive = true;
    }
}


