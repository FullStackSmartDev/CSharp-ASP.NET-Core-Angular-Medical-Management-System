import { PatientChartTreeItem } from './patientChartTreeItem';
import { PatientChartContextMenuActionItem } from './patientChartContextMenuActionItem';
import { PatientChartContextMenuActions } from './patientChartContextMenuActions';

export class PatientChartContextMenuActionItems {
    constructor(private patientChartTreeItem: PatientChartTreeItem) {
    }

    get newTemplate(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.NewTemplate,
            "New Template", this.patientChartTreeItem);
    }

    get editTemplate(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.EditTemplate,
            "Edit Template", this.patientChartTreeItem);
    }

    get deleteTemplate(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.DeleteTemplate,
            "Delete Template", this.patientChartTreeItem);
    }

    get newSection(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.NewSection,
            "New Section", this.patientChartTreeItem);
    }

    get editSection(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.EditSection,
            "Edit Section", this.patientChartTreeItem);
    }

    get deleteSection(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.DeleteSection,
            "Delete Section", this.patientChartTreeItem);
    }

    get newTemplateList(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.NewTemplateList,
            "New Template list", this.patientChartTreeItem);
    }

    get editTemplateList(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.EditTemplateList,
            "Edit Template List", this.patientChartTreeItem);
    }

    get deleteTemplateList(): PatientChartContextMenuActionItem {
        return new PatientChartContextMenuActionItem(PatientChartContextMenuActions.DeleteTemplateList,
            "Delete Template List", this.patientChartTreeItem);
    }
} 