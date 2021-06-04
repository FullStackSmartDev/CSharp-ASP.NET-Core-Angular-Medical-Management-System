import { Injectable } from '@angular/core';
import { PatientChartContextMenuActionItem } from '../classes/patientChartContextMenuActionItem';
import { PatientChartTreeItem } from '../classes/patientChartTreeItem';
import { PatientChartTreeItemType } from '../classes/patientChartTreeItemType';
import { PatientChartContextMenuActionItems } from '../classes/patientChartContextMenuActionItems';


@Injectable()
export class PatientChartContextMenuService {
    getContextMenuItemsBasedOnPatientChartTreeViewItem(patientChartTreeItem: PatientChartTreeItem): any[] {
        const itemType = patientChartTreeItem.itemType;
        const isPredefinedChartTreeItem =
            patientChartTreeItem.isPredefined;

        const patientChartContextMenuActionItems =
            new PatientChartContextMenuActionItems(patientChartTreeItem);

        if (isPredefinedChartTreeItem)
            return this.getCommonContextMenuItems(patientChartContextMenuActionItems);

        switch (itemType) {
            case PatientChartTreeItemType.Section:
                return this.getSectionContextMenuItems(patientChartContextMenuActionItems);

            case PatientChartTreeItemType.Template:
                return this.getTemplateContextMenuItems(patientChartContextMenuActionItems);

            case PatientChartTreeItemType.TemplateList:
                return this.getTemplateListContextMenuItems(patientChartContextMenuActionItems);
        }
    }

    private getCommonContextMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuActionItem[] {
        return [
            patientChartContextMenuActionItems.newSection,
            patientChartContextMenuActionItems.newTemplate,
            patientChartContextMenuActionItems.newTemplateList
        ];
    }

    private getSectionContextMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuActionItem[] {
        const commonContextMenuItems =
            this.getCommonContextMenuItems(patientChartContextMenuActionItems);

        const sectionContextMenuItems = [
            patientChartContextMenuActionItems.editSection,
            patientChartContextMenuActionItems.deleteSection
        ];

        return commonContextMenuItems
            .concat(sectionContextMenuItems);
    }

    private getTemplateContextMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuActionItem[] {
        const commonContextMenuItems =
            this.getCommonContextMenuItems(patientChartContextMenuActionItems);

        const templateContextMenuItems = [
            patientChartContextMenuActionItems.editTemplate,
            patientChartContextMenuActionItems.deleteTemplate
        ];

        return commonContextMenuItems
            .concat(templateContextMenuItems);
    }

    private getTemplateListContextMenuItems(patientChartContextMenuActionItems: PatientChartContextMenuActionItems)
        : PatientChartContextMenuActionItem[] {
        const commonContextMenuItems =
            this.getCommonContextMenuItems(patientChartContextMenuActionItems);

        const templateListContextMenuItems = [
            patientChartContextMenuActionItems.editTemplateList,
            patientChartContextMenuActionItems.deleteTemplateList
        ];

        return commonContextMenuItems
            .concat(templateListContextMenuItems);
    }
}