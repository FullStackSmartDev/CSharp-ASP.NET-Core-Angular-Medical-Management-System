export class TemplateNodeInfo {
    id: string;
    order: number;
    title: string;
    sectionId: string;

    constructor(id: string, order: number, title: string, sectionId) {
        this.id = id;
        this.title = title;
        this.order = order;
        this.sectionId = sectionId;
    }
}