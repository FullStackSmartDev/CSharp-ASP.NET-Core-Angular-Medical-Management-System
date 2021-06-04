import { PatientChartAdminNode } from './patientChartAdminNode';
import { PatientChartContextMenuAction } from './patientChartContextMenuAction';
import { PatientChartContextMenuActionTypes } from './patientChartContextMenuActionTypes';

export class PatientChartContextMenuActionItems {
    constructor(private patientChartTreeItem: PatientChartAdminNode) {
    }

    get newTemplate(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.NewTemplate,
            "New Template", this.patientChartTreeItem);
    }

    get editTemplate(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.EditTemplate,
            "Edit Template", this.patientChartTreeItem);
    }

    get deleteNode(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.DeleteNode,
            "Delete Node", this.patientChartTreeItem);
    }

    get newSection(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.NewSectionNode,
            "New Section", this.patientChartTreeItem);
    }

    get editSection(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.EditSectionNode,
            "Edit Section", this.patientChartTreeItem);
    }

    get newTemplateList(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.NewTemplateList,
            "New Template list", this.patientChartTreeItem);
    }

    get editTemplateList(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.EditTemplateList,
            "Edit Template List", this.patientChartTreeItem);
    }

    get newDocumentNode(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.NewDocumentNode,
            "New Document", this.patientChartTreeItem);
    }

    get editDocumentNode(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.EditDocumentNode,
            "Edit Document", this.patientChartTreeItem);
    }

    get copyNode(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.CopyNode,
            "Copy Node", this.patientChartTreeItem);
    };

    get pasteNode(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.PasteNode,
            "Paste Node", this.patientChartTreeItem);
    };

    get editNodeTitle(): PatientChartContextMenuAction {
        return new PatientChartContextMenuAction(PatientChartContextMenuActionTypes.EditNodeTitle,
            "Edit Node Title", this.patientChartTreeItem);
    };
} 