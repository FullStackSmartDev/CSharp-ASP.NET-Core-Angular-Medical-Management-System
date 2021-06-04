export class TemplateType {
    id: string;
    companyId: string;
    name: string;
    title: string;
    isActive: boolean;
    isPredefined: boolean;

    constructor() {
        this.isActive = true;
    }
}