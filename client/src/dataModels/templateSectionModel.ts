export class TemplateSectionModel {
    Id: string;
    Name: string;
    Order: number;
    Title: string;
    SectionId: string;

    constructor(id: string, name: string, order: number, title: string, sectionId){
        this.Id = id;
        this.Name= name;
        this.Title = title;
        this.Order = order;
        this.SectionId = sectionId;
    }
}