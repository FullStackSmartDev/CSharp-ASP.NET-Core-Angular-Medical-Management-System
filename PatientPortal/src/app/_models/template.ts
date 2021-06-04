export class Template {
    id: string;
    companyId: string;
    templateOrder: number;
    name: string;
    title: string;
    reportTitle: string;
    detailedTemplateHtml: string;
    initialDetailedTemplateHtml: string;
    defaultTemplateHtml: string;
    isRequired: boolean;
    isActive: boolean;
    isHistorical: boolean;
    templateTypeId: string;

    constructor() {
        this.isActive = true;
        this.isRequired = false;
        this.isHistorical = false;
    }
}