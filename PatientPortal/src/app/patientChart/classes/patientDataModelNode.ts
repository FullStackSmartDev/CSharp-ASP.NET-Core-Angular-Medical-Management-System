export class PatientDataModelNode {
    id: string;
    text: string;
    name: string;
    expanded: boolean;
    checked: boolean;
    isRequired: boolean;
    visible: boolean;
    items: Array<PatientDataModelNode> = [];
    selected: boolean;
    templateName: string;
    isNotVisibleInReport: boolean;

    constructor(id: string,
        text: string, name: string, expanded: boolean,
        visible: boolean, isNotVisibleInReport: boolean,
        checked?: boolean, isRequired?: boolean) {
        this.id = id;
        this.text = text;
        this.name = name;
        this.expanded = expanded;
        this.visible = visible;
        this.checked = checked ? true : false;
        this.isRequired = isRequired ? true : false;
        this.selected = false;
        this.templateName = "";
        this.isNotVisibleInReport = isNotVisibleInReport;
    }
}