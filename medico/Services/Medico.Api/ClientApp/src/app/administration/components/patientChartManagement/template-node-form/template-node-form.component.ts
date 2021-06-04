import { Component, ViewChild, Input, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { TemplateService } from 'src/app/_services/template.service';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { PatientChartContextMenuAction } from 'src/app/administration/classes/patientChartContextMenuAction';
import { PatientChartNodeChanges } from 'src/app/administration/classes/patientChartNodeChanges';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartContextMenuActionTypes } from 'src/app/administration/classes/patientChartContextMenuActionTypes';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { PatientChartNodeTemplateProviderService } from 'src/app/_services/patient-chart-node-template-provider.service';
import { PatientChartNodeAttributes } from 'src/app/_models/patientChartNodeAttributes';
import { Template } from 'src/app/_models/template';
import { BaseTemplateService } from 'src/app/_services/base-template.service';
import { LibraryTemplateService } from 'src/app/administration/services/library/library-template.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { BaseTemplateTypeService } from 'src/app/_services/base-template-type.service';
import { LibraryTemplateTypeService } from 'src/app/administration/services/library/library-template-type.service';

@Component({
    selector: "template-node-form",
    templateUrl: "template-node-form.html"
})
export class TemplateNodeFormComponent implements OnInit {
    @ViewChild("templateNodeForm", { static: false }) templateNodeForm: DxFormComponent;

    @Input() patientChartContextMenuAction: PatientChartContextMenuAction;
    @Input() companyId: string;
    @Input() isLibraryManagement: boolean;

    @Output() onTemplateNodeEdited: EventEmitter<PatientChartNodeChanges> =
        new EventEmitter<PatientChartNodeChanges>();

    @Output() onTemplateNodeAdded: EventEmitter<PatientChartNode> =
        new EventEmitter<PatientChartNode>();

    templateService: BaseTemplateService
    templateTypeService: BaseTemplateTypeService

    templateDataSource: any = {};

    templateNode: any = {
        templateId: "",
        title: ""
    };

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private injector: Injector) {
    }

    get isEditMode(): boolean {
        const actionType =
            this.patientChartContextMenuAction.actionType;

        return actionType === PatientChartContextMenuActionTypes
            .EditTemplate;
    }

    ngOnInit() {
        this.initTemplateService(this.isLibraryManagement, this.injector);
        this.initTemplateTypeService(this.isLibraryManagement, this.injector);
        this.setupTemplateNode();
        this.initTemplateDataSource(this.isLibraryManagement);
    }

    createUpdateTemplateNode() {
        const validationResult = this.templateNodeForm
            .instance.validate();

        if (!validationResult.isValid)
            return;

        const newTemplateNodeTitle = this.templateNode.title;
        const templateId = this.templateNode.templateId;

        const templateTypePromise =
            this.templateTypeService.getByTemplateId(templateId, this.companyId);

        const templatePromise =
            this.templateService.getById(templateId);

        Promise.all([templateTypePromise, templatePromise])
            .then(result => {
                const templateType = result[0];
                const template = result[1];

                if (this.isEditMode) {
                    this.processTemplateNodeEditing(newTemplateNodeTitle, template, templateType.name);
                    return;
                }

                this.processTemplateNodeAdding(newTemplateNodeTitle, template, templateType.name);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private setupTemplateNode() {
        if (this.isEditMode) {
            const templateId =
                this.patientChartContextMenuAction
                    .patientChartTreeItem.templateId;

            this.templateNode.templateId = templateId;
            this.templateNode.title = this.patientChartContextMenuAction.patientChartTreeItem.text
        }
    }

    private processTemplateNodeAdding(newTemplateNodeTitle: string,
        template: Template, templateTypeName: string) {

        template.title = newTemplateNodeTitle;
        template.reportTitle = newTemplateNodeTitle;

        const newTemplateNodeParentId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        const newTemplateNodeId = GuidHelper.generateNewGuid();

        const newTemplateNode = PatientChartNode
            .createPatientChartTemplateNode(newTemplateNodeId,
                newTemplateNodeParentId, template, templateTypeName);

        this.onTemplateNodeAdded.next(newTemplateNode);
    }

    private processTemplateNodeEditing(newTemplateNodeTitle: string,
        template: Template, templateTypeName: string) {
        const templateNodeChanges = new PatientChartNodeChanges();

        templateNodeChanges.nodeId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        const templateNodeValue = {
            defaultTemplateHtml: template.defaultTemplateHtml,
            detailedTemplateHtml: template.initialDetailedTemplateHtml,
            isDetailedTemplateUsed: !template.defaultTemplateHtml
        };

        const nodeSpecificAttributes = {
            templateId: template.id
        };

        const isTemplateNodeActive = this.patientChartContextMenuAction
            .patientChartTreeItem.isActive;

        const isPredefinedTemplateNode =
            this.patientChartContextMenuAction
                .patientChartTreeItem.isPredefined;

        const newTemplateNodeAttributes = PatientChartNodeAttributes
            .createPatientChartNodeAttributes(template.templateOrder,
                isTemplateNodeActive, false, false, isPredefinedTemplateNode, nodeSpecificAttributes);

        templateNodeChanges.changes = {
            title: newTemplateNodeTitle,
            value: templateNodeValue,
            template: PatientChartNodeTemplateProviderService
                .getTemplateValueForPatientChartTemplateNode(template.id, templateTypeName),
            attributes: newTemplateNodeAttributes
        };

        this.onTemplateNodeEdited
            .next(templateNodeChanges);
    }

    private initTemplateDataSource(isLibraryManagement: boolean) {
        const templateUrl = isLibraryManagement
            ? ApiBaseUrls.libraryTemplates
            : ApiBaseUrls.templates;

        this.templateDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(templateUrl),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    if (!isLibraryManagement)
                        jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private initTemplateService(isLibraryManagement: boolean, injector: Injector) {
        this.templateService =
            injector.get(isLibraryManagement ? LibraryTemplateService : TemplateService);
    }

    private initTemplateTypeService(isLibraryManagement: boolean, injector: Injector) {
        this.templateTypeService =
            injector.get(isLibraryManagement ? LibraryTemplateTypeService : TemplateTypeService);
    }
}