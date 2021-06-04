import { Injectable } from '@angular/core';
import { PatientChartContextMenuActionItems } from '../classes/patientChartContextMenuActionItems';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import { PatientChartAdminNode } from '../classes/patientChartAdminNode';
import { PatientChartContextMenuAction } from '../classes/patientChartContextMenuAction';


@Injectable()
export class PatientChartContextMenuService {
    getContextMenuItemsBasedOnPatientChartNode(patientChartTreeItem: PatientChartAdminNode,
        isCopiedPatientChartNodeExist: boolean): PatientChartContextMenuAction[] {
        const itemType = patientChartTreeItem.itemType;

        const patientChartContextMenuActionItems =
            new PatientChartContextMenuActionItems(patientChartTreeItem);

        switch (itemType) {
            case PatientChartNodeType.RootNode:
                return this.getRootNodeMenuItems(patientChartContextMenuActionItems);

            case PatientChartNodeType.DocumentNode:
                return this.getDocumentNodeMenuItems(patientChartContextMenuActionItems, isCopiedPatientChartNodeExist);

            case PatientChartNodeType.SectionNode:
                return this.getSectionNodeMenuItems(patientChartContextMenuActionItems, isCopiedPatientChartNodeExist);

            case PatientChartNodeType.TemplateNode:
                return this.getTemplateNodeMenuItems(patientChartContextMenuActionItems);

            case PatientChartNodeType.TemplateListNode:
                return this.getTemplateListNodeMenuItems(patientChartContextMenuActionItems);

            case PatientChartNodeType.ChiefComplaintNode:
            case PatientChartNodeType.VitalSignsNode:
            case PatientChartNodeType.AssessmentNode:
            case PatientChartNodeType.ScanDocumentNode:
            case PatientChartNodeType.PrescriptionNode:
            case PatientChartNodeType.AddendumNode:
            case PatientChartNodeType.TobaccoHistoryNode:
            case PatientChartNodeType.DrugHistoryNode:
            case PatientChartNodeType.AlcoholHistoryNode:
            case PatientChartNodeType.PreviousMedicalHistoryNode:
            case PatientChartNodeType.PreviousSurgicalHistoryNode:
            case PatientChartNodeType.FamilyHistoryNode:
            case PatientChartNodeType.EducationNode:
            case PatientChartNodeType.OccupationalHistoryNode:
            case PatientChartNodeType.AllergiesNode:
            case PatientChartNodeType.MedicationsNode:
            case PatientChartNodeType.ReviewedMedicalRecordsNode:
                return this.getCustomNodeMenuItems(patientChartContextMenuActionItems);
        }
    }

    private getSectionNodeMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems,
        isCopiedPatientChartNodeExist: boolean)
        : PatientChartContextMenuAction[] {
        const menuItems = [
            patientChartContextMenuActionItems.editSection,
            patientChartContextMenuActionItems.deleteNode,
            patientChartContextMenuActionItems.newSection,
            patientChartContextMenuActionItems.newTemplate,
            patientChartContextMenuActionItems.newTemplateList
        ];

        if (isCopiedPatientChartNodeExist)
            menuItems.push(patientChartContextMenuActionItems.pasteNode);

        return menuItems;
    }

    private getTemplateNodeMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuAction[] {

        return [
            patientChartContextMenuActionItems.editTemplate,
            patientChartContextMenuActionItems.deleteNode
        ];
    }

    private getTemplateListNodeMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuAction[] {

        return [
            patientChartContextMenuActionItems.editTemplateList,
            patientChartContextMenuActionItems.deleteNode
        ];
    }

    private getRootNodeMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuAction[] {
        return [
            patientChartContextMenuActionItems.newDocumentNode
        ];
    }

    private getDocumentNodeMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems,
        isCopiedPatientChartNodeExist: boolean)
        : PatientChartContextMenuAction[] {
        const menuItems = [
            patientChartContextMenuActionItems.editDocumentNode,
            patientChartContextMenuActionItems.deleteNode,
            patientChartContextMenuActionItems.newSection,
            patientChartContextMenuActionItems.newTemplate,
            patientChartContextMenuActionItems.newTemplateList
        ];

        if (isCopiedPatientChartNodeExist)
            menuItems.push(patientChartContextMenuActionItems.pasteNode);

        return menuItems;
    }

    getCustomNodeMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuAction[] {
        return [
            patientChartContextMenuActionItems.deleteNode,
            patientChartContextMenuActionItems.copyNode,
            patientChartContextMenuActionItems.editNodeTitle
        ];
    }
}