import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { PatientChartContextMenuActionItem } from 'src/app/administration/classes/patientChartContextMenuActionItem';
import { PatientChartContextMenuActions } from 'src/app/administration/classes/patientChartContextMenuActions';
import { PatientChartService } from 'src/app/patientChart/services/patient-chart.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { PatientChartTreeItemType } from 'src/app/administration/classes/patientChartTreeItemType';

@Component({
    selector: "chart-template-list-management",
    templateUrl: "chart-template-list-management.component.html"
})
export class ChartTemplateListManagementComponent implements OnInit {
    @ViewChild("templateListSectionForm", { static: false }) templateListSectionForm: DxFormComponent;

    @Input() patientChartContextMenuActionItem: PatientChartContextMenuActionItem;
    @Input() patientChartTree: any;
    @Input() companyId: string;

    @Output() onPatientChartChanged: EventEmitter<string>
        = new EventEmitter();

    templateTypeDataSource: any = {};

    templateListSection: any = {
        templateTypeId: "",
        isNewTemplateList: true
    };

    constructor(private patientChartService: PatientChartService,
        private templateTypeService: TemplateTypeService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    ngOnInit() {
        this.setupTemplateBasedOnContextMenuActionItem();
        this.initTemplateTypeDataSource();
    }

    validateTemplateListExistenceInPatientChart = (params) => {
        const templateTypeId = params.value;

        this.templateTypeService.getById(templateTypeId)
            .then(templateType => {
                const templateTypeName = templateType.name;
                const patientChartSection =
                    this.patientChartService
                        .getPatientChartSectionByName(templateTypeName, this.patientChartTree.patientRoot);

                const isPatientChartSectionExist =
                    !!patientChartSection && patientChartSection.id !== this.patientChartContextMenuActionItem.patientChartTreeItem.id;

                params.rule.isValid = !isPatientChartSectionExist;
                params.rule.message = `Template list is'${templateType.title}' already exists in patient chart tree.`;

                params.validator.validate();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

        return false;
    }

    createUpdateTemplateListSection() {
        const validationResult = this.templateListSectionForm
            .instance.validate();

        if (!validationResult.isValid)
            return;

        if (this.templateListSection.isNewTemplateList)
            this.addNewTemplateListSection();
        else
            this.updateTemplateListSection();
    }

    private setupTemplateBasedOnContextMenuActionItem() {
        const action =
            this.patientChartContextMenuActionItem.action;

        if (action === PatientChartContextMenuActions.EditTemplateList) {
            const templateTypeName =
                this.patientChartContextMenuActionItem
                    .patientChartTreeItem.name;

            this.templateTypeService.getByName(templateTypeName, this.companyId)
                .then(templateType => {
                    this.templateListSection.templateTypeId = templateType.id;
                    this.templateListSection.isNewTemplateList = false;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    private initTemplateTypeDataSource() {
        this.templateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("templateType"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private addNewTemplateListSection() {
        const itemType =
            this.patientChartContextMenuActionItem.patientChartTreeItem.itemType;

        let parentSectionId = "";

        if (itemType === PatientChartTreeItemType.Section)
            parentSectionId = this.patientChartContextMenuActionItem.patientChartTreeItem.id;
        else
            parentSectionId = this.patientChartContextMenuActionItem
                .patientChartTreeItem.parentPatientChartTreeItemId;

        const parentSection = this.patientChartService
            .getPatientChartSectionById(parentSectionId, this.patientChartTree.patientRoot);

        this.templateTypeService.getById(this.templateListSection.templateTypeId)
            .then(templateType => {
                const newTemplateListSection = this.patientChartService
                    .createPatientChartTemplateListSection(parentSectionId, templateType, {});

                parentSection.children.push(newTemplateListSection);

                this.onPatientChartChanged.next(parentSectionId);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private updateTemplateListSection() {
        const sectionId = this.patientChartContextMenuActionItem
            .patientChartTreeItem.id;

        const section = this.patientChartService
            .getPatientChartSectionById(sectionId, this.patientChartTree.patientRoot);

        this.templateTypeService.getById(this.templateListSection.templateTypeId)
            .then(templateType => {
                this.patientChartService
                    .updatePatientChartTemplateListSection(section, templateType, {});

                this.onPatientChartChanged.next(sectionId);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}