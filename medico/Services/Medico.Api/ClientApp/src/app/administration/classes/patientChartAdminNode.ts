import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

export class PatientChartAdminNode {
    id: string;
    text: string;
    name: string;
    expanded: boolean;
    items: PatientChartAdminNode[];
    itemType: PatientChartNodeType;
    isPredefined: boolean;
    parentPatientChartTreeItemId: string;
    order: number;
    isActive: boolean;
    templateId: string | null;

    constructor(id: string,
        text: string, name: string, expanded: boolean,
        itemType: PatientChartNodeType,
        isPredefined: boolean,
        parentPatientChartTreeItemId: string,
        order: number, isActive: boolean, templateId: string | null) {
        this.id = id;
        this.text = text;
        this.name = name;
        this.expanded = expanded;
        this.items = [];
        this.itemType = itemType;
        this.isPredefined = isPredefined;
        this.parentPatientChartTreeItemId = parentPatientChartTreeItemId;
        this.order = order;
        this.isActive = isActive;
        this.templateId = templateId;
    }
}