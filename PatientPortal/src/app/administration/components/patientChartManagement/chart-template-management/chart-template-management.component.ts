import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { PatientChartContextMenuActionItem } from 'src/app/administration/classes/patientChartContextMenuActionItem';
import { PatientChartContextMenuActions } from 'src/app/administration/classes/patientChartContextMenuActions';
import { PatientChartService } from 'src/app/patientChart/services/patient-chart.service';
import { TemplateService } from 'src/app/_services/template.service';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { PatientChartTreeItemType } from 'src/app/administration/classes/patientChartTreeItemType';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';

@Component({
    selector: "chart-template-management",
    templateUrl: "chart-template-management.component.html"
})
export class ChartTemplateManagementComponent implements OnInit {
    @ViewChild("templateSectionForm", { static: false }) templateSectionForm: DxFormComponent;

    @Input() patientChartContextMenuActionItem: PatientChartContextMenuActionItem;
    @Input() patientChartTree: any;
    @Input() companyId: string;

    @Output() onPatientChartChanged: EventEmitter<string>
        = new EventEmitter();

    templateDataSource: any = {};

    templateSection: any = {
        templateId: "",
        isNewTemplate: true
    };

    constructor(private patientChartService: PatientChartService,
        private templateService: TemplateService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private templateTypeService: TemplateTypeService) {
    }

    ngOnInit() {
        this.setupTemplateBasedOnContextMenuActionItem();
        this.initTemplateDataSource();
    }

    validateTemplateExistenceInPatientChart = (params) => {
        const templateId = params.value;

        this.templateService.getById(templateId)
            .then(template => {
                const templateName = template.name;
                const patientChartSection =
                    this.patientChartService
                        .getPatientChartSectionByName(templateName, this.patientChartTree.patientRoot);

                const isPatientChartSectionExist =
                    !!patientChartSection && patientChartSection.id !== this.patientChartContextMenuActionItem.patientChartTreeItem.id;

                params.rule.isValid = !isPatientChartSectionExist;
                params.rule.message = `Template '${template.reportTitle}' already exists in patient chart tree.`;

                params.validator.validate();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

        return false;
    }

    createUpdateTemplateSection() {
        const validationResult = this.templateSectionForm
            .instance.validate();

        if (!validationResult.isValid)
            return;

        if (this.templateSection.isNewTemplate)
            this.addNewTemplateSection();
        else
            this.updateTemplateSection();
    }

    private setupTemplateBasedOnContextMenuActionItem() {
        const action =
            this.patientChartContextMenuActionItem.action;

        if (action === PatientChartContextMenuActions.EditTemplate) {
            const templateName =
                this.patientChartContextMenuActionItem.patientChartTreeItem.name;

            this.templateService.getByName(templateName, this.companyId)
                .then(template => {
                    this.templateSection.templateId = template.id;
                    this.templateSection.isNewTemplate = false;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    private initTemplateDataSource() {
        this.templateDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("template"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private addNewTemplateSection() {
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

        this.getTemplateWithTemplateTypeName()
            .then(templateWithTemplateType => {
                const template = templateWithTemplateType.template;
                const templateTypeName = templateWithTemplateType.templateTypeName;

                const newTemplateSection = this.patientChartService
                    .createPatientChartTemplateSection(parentSectionId, templateTypeName, template, {});

                parentSection.children.push(newTemplateSection);

                this.onPatientChartChanged.next(parentSectionId);

            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private updateTemplateSection() {
        const sectionId = this.patientChartContextMenuActionItem
            .patientChartTreeItem.id;

        const section = this.patientChartService
            .getPatientChartSectionById(sectionId, this.patientChartTree.patientRoot);

        this.getTemplateWithTemplateTypeName()
            .then(templateWithTemplateType => {
                const template = templateWithTemplateType.template;
                const templateTypeName = templateWithTemplateType.templateTypeName;

                this.patientChartService
                    .updatePatientChartTemplateSection(section, templateTypeName, template, {});

                this.onPatientChartChanged.next(sectionId);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private getTemplateWithTemplateTypeName(): Promise<any> {
        return this.templateService.getById(this.templateSection.templateId)
            .then(template => {
                const templateTypeId = template.templateTypeId;
                return this.templateTypeService.getById(templateTypeId)
                    .then(templateType => {
                        return {
                            templateTypeName: templateType.name,
                            template: template
                        };
                    });
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}