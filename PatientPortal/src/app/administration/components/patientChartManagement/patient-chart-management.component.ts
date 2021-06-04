import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { Subscription } from 'rxjs';
import { PatientChartService } from 'src/app/patientChart/services/patient-chart.service';
import { CompanyService } from 'src/app/_services/company.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DxContextMenuComponent, DxPopupComponent } from 'devextreme-angular';
import { PatientChartContextMenuService } from '../../services/patient-chart-context-menu.service';
import { PatientChartContextMenuActionItem } from '../../classes/patientChartContextMenuActionItem';
import { PatientChartTreeItem } from '../../classes/patientChartTreeItem';
import { PatientChartContextMenuActions } from '../../classes/patientChartContextMenuActions';
import { PatientChartConfig } from 'src/app/_models/patientChartConfig';
import { PatientChartTreeItemType } from '../../classes/patientChartTreeItemType';

@Component({
    selector: "patient-chart-management",
    templateUrl: "patient-chart-management.component.html"
})
export class PatientChartManagementComponent implements OnInit, OnDestroy {
    @ViewChild("contextMenu", { static: false }) contextMenu: DxContextMenuComponent;
    @ViewChild("createEditPatientChartTreeItemPopup", { static: false }) createEditPatientChartTreeItemPopup: DxPopupComponent;

    sectionPreviewItem: any;

    companyIdSubscription: Subscription;
    companyId: string;

    patientChartTreeView: PatientChartTreeItem[] = [];
    patientChartTree: any;

    patientChartConfigFullInfo: PatientChartConfig;

    isCreateEditPatientChartTreeItemPopupOpened: boolean = false;

    patientChartContextMenuActionItem: PatientChartContextMenuActionItem

    constructor(private companyIdService: CompanyIdService,
        private patientChartService: PatientChartService,
        private companyService: CompanyService,
        private alertService: AlertService,
        private patientChartContextMenuService: PatientChartContextMenuService) {
    }

    get isSectionPreviewVisible(): boolean {
        return !!this.sectionPreviewItem;
    }

    get isSectionManagementComponentVisible(): boolean {
        return this.isCreateEditPatientChartTreeItemPopupOpened &&
            this.patientChartContextMenuActionItem &&
            (this.patientChartContextMenuActionItem.action === PatientChartContextMenuActions.NewSection
                || this.patientChartContextMenuActionItem.action === PatientChartContextMenuActions.EditSection);
    }

    get isChartTemplateManagementComponentVisible(): boolean {
        return this.isCreateEditPatientChartTreeItemPopupOpened &&
            this.patientChartContextMenuActionItem &&
            (this.patientChartContextMenuActionItem.action === PatientChartContextMenuActions.NewTemplate
                || this.patientChartContextMenuActionItem.action === PatientChartContextMenuActions.EditTemplate);
    }

    get isTemplateListManagementComponentVisible(): boolean {
        return this.isCreateEditPatientChartTreeItemPopupOpened &&
            this.patientChartContextMenuActionItem &&
            (this.patientChartContextMenuActionItem.action === PatientChartContextMenuActions.NewTemplateList
                || this.patientChartContextMenuActionItem.action === PatientChartContextMenuActions.EditTemplateList);
    }

    onPatientChartChanged($event) {
        this.updatePatientChartTree($event);
    }

    onPatientChartContextMenuClick($event) {
        const itemData = $event.itemData;
        const action = itemData.action;
        const isDeleteAction = action === PatientChartContextMenuActions.DeleteSection ||
            action === PatientChartContextMenuActions.DeleteTemplate ||
            action === PatientChartContextMenuActions.DeleteTemplateList;

        if (isDeleteAction)
            this.deletePatientChartSectionWithConfirmation(itemData.patientChartTreeItem.id,
                itemData.patientChartTreeItem.text, itemData.patientChartTreeItem.parentPatientChartTreeItemId, action);
        else {
            this.patientChartContextMenuActionItem =
                $event.itemData;
            this.isCreateEditPatientChartTreeItemPopupOpened = true;
        }
    }

    selectPatientChartItem($event) {
        const selectedPatientTreeItem = $event.itemData;
        this.sectionPreviewItem = {
            name: selectedPatientTreeItem.text
        }

        const itemType = selectedPatientTreeItem.itemType;

        let itemTypeName = "";
        switch (itemType) {
            case PatientChartTreeItemType.Section:
                itemTypeName = "section";
                break;

            case PatientChartTreeItemType.Template:
                itemTypeName = "template";
                break;

            case PatientChartTreeItemType.TemplateList:
                itemTypeName = "template list";
                break;

            case PatientChartTreeItemType.Undefined:
                itemTypeName = "undefined";
                break;
        }

        this.sectionPreviewItem.type = itemTypeName;
    }

    openPatientChartContextMenu($event) {
        $event.event.preventDefault();
        this.setUpContextMenu($event);
    }

    onCreateEditPatientChartTreeItemPopupHidden() {
        this.patientChartContextMenuActionItem = null;
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    ngOnDestroy(): void {
        if (this.companyIdSubscription)
            this.companyIdSubscription.unsubscribe();
    }

    private updatePatientChartTree(expandedPatientChartTreeSectionId: string, isDeleteAction: boolean = false) {
        this.patientChartConfigFullInfo.patientChartJsonConfig =
            JSON.stringify(this.patientChartTree);

        this.companyService.updatePatientChartConfig(this.patientChartConfigFullInfo)
            .then(() => {
                const adminPatientChartTreeOptions = {
                    expandedSectionId: expandedPatientChartTreeSectionId
                };
                this.patientChartTreeView = [this.patientChartService
                    .getPatientChartAdminTree(this.patientChartTree.patientRoot, adminPatientChartTreeOptions)];

                if (!isDeleteAction)
                    this.isCreateEditPatientChartTreeItemPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private deletePatientChartSectionWithConfirmation(id: string,
        sectionTitle: string, parentSectionId: string, action: PatientChartContextMenuActions) {
        const sectionName = this.getSectionNameWithType(action, sectionTitle);

        this.alertService
            .confirm(`Are you sure you want to delete  ${sectionName} from patient chart tree ?`, "Confirm deletion")
            .then(confirmationResult => {
                if (!confirmationResult)
                    return;

                this.patientChartService.deleteSectionFromPatientChart(id, parentSectionId, this.patientChartTree);
                this.updatePatientChartTree(parentSectionId, true);
            })
    }

    private getSectionNameWithType(action: PatientChartContextMenuActions, sectionTitle: string): string {
        let sectionTypeName;

        switch (action) {
            case PatientChartContextMenuActions.DeleteSection:
                sectionTypeName = "section";
                break;

            case PatientChartContextMenuActions.DeleteTemplate:
                sectionTypeName = "template";
                break;

            case PatientChartContextMenuActions.DeleteTemplateList:
                sectionTypeName = "template list";
                break;

            default: throw "Unable to find type name for action";
        }

        return `'${sectionTitle}' ${sectionTypeName}`
    }

    private setUpContextMenu($event: any) {
        this.contextMenu.target = $event.event.target;
        const patientChartTreeItem = $event.itemData

        this.contextMenu.dataSource =
            this.patientChartContextMenuService
                .getContextMenuItemsBasedOnPatientChartTreeViewItem(patientChartTreeItem);

        this.contextMenu.visible = true;
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    this.companyService.getPatientChartConfigFullInfo(companyId)
                        .then(patientChartConfigFullInfo => {
                            this.patientChartConfigFullInfo = patientChartConfigFullInfo;

                            const patientChartConfig = JSON.parse(patientChartConfigFullInfo.patientChartJsonConfig);
                            this.patientChartTree = patientChartConfig;
                            this.patientChartTreeView = [this.patientChartService
                                .getPatientChartAdminTree(patientChartConfig.patientRoot)];
                            
                            this.sectionPreviewItem = null;
                        })
                        .catch(error => this.alertService.error(error.message ? error.message : error));
                }
            });
    }
}