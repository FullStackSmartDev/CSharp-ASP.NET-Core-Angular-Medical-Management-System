import { PatientChartContextMenuActions } from './patientChartContextMenuActions';
import { PatientChartTreeItem } from './patientChartTreeItem';

export class PatientChartContextMenuActionItem {
    action: PatientChartContextMenuActions;
    text: string;
    patientChartTreeItem: PatientChartTreeItem;

    constructor(action: PatientChartContextMenuActions,
        text: string, patientChartTreeItem: PatientChartTreeItem) {
        this.action = action;
        this.text = text;
        this.patientChartTreeItem = patientChartTreeItem;
    }
}