import { PatientChartAdminNode } from './patientChartAdminNode';
import { PatientChartContextMenuActionTypes } from './patientChartContextMenuActionTypes';

export class PatientChartContextMenuAction {
    actionType: PatientChartContextMenuActionTypes;
    text: string;
    patientChartTreeItem: PatientChartAdminNode;
 
    constructor(actionType: PatientChartContextMenuActionTypes,
        text: string, patientChartTreeItem: PatientChartAdminNode) {
        this.actionType = actionType;
        this.text = text;
        this.patientChartTreeItem = patientChartTreeItem;
    }
}