import { PatientChartTreeItemType } from './patientChartTreeItemType';

export class PatientChartTreeItem {
    id: string;
    text: string;
    name: string;
    expanded: boolean;
    items: PatientChartTreeItem[];
    itemType: PatientChartTreeItemType;
    isPredefined: boolean;
    parentPatientChartTreeItemId: string;

    constructor(id: string,
        text: string, name: string, expanded: boolean,
        itemType: PatientChartTreeItemType,
        isPredefined: boolean, parentPatientChartTreeItemId: string) {
        this.id = id;
        this.text = text;
        this.name = name;
        this.expanded = expanded;
        this.items = [];
        this.itemType = itemType;
        this.isPredefined = isPredefined;
        this.parentPatientChartTreeItemId = parentPatientChartTreeItemId;
    }
}