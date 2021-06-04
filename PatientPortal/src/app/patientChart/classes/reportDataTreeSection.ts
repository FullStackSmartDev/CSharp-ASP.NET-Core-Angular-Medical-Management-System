export class ReportDataTreeSection {
    name: string;
    templteName: string;
    html: string;
    childSections: ReportDataTreeSection[];

    constructor(name: string = "", html: string = "",
        childSections: ReportDataTreeSection[] = [], templateName: string = "") {
        this.name = name;
        this.templteName = templateName;
        this.html = html;
        this.childSections = childSections;
    }
}