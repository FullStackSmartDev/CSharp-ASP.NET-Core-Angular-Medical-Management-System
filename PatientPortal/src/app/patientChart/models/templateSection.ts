export class TemplateSection {
    id: string;
    name: string;
    order: number;
    title: string;
    sectionId: string;

    constructor(id: string, name: string, order: number, title: string, sectionId) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.order = order;
        this.sectionId = sectionId;
    }
}