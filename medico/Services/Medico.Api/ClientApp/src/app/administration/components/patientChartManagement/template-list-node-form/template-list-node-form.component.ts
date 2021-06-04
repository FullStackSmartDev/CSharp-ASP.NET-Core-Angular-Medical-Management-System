import { Component, ViewChild, Input, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { PatientChartContextMenuAction } from 'src/app/administration/classes/patientChartContextMenuAction';
import { PatientChartNodeChanges } from 'src/app/administration/classes/patientChartNodeChanges';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartContextMenuActionTypes } from 'src/app/administration/classes/patientChartContextMenuActionTypes';
import { TemplateType } from 'src/app/_models/templateType';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { PatientChartNodeAttributes } from 'src/app/_models/patientChartNodeAttributes';
import { PatientChartNodeTemplateProviderService } from 'src/app/_services/patient-chart-node-template-provider.service';
import { BaseTemplateTypeService } from 'src/app/_services/base-template-type.service';
import { LibraryTemplateTypeService } from 'src/app/administration/services/library/library-template-type.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { PatientChartAdminNode } from 'src/app/administration/classes/patientChartAdminNode';

@Component({
    selector: "template-list-node-form",
    templateUrl: "template-list-node-form.html"
})
export class TemplateListNodeFormComponent implements OnInit {
    @ViewChild("templateListNodeForm", { static: false }) templateListNodeForm: DxFormComponent;

    @Input() patientChartContextMenuAction: PatientChartContextMenuAction;
    @Input() companyId: string;
    @Input() isLibraryManagement: boolean;

    @Output() onTemplateListNodeEdited: EventEmitter<PatientChartNodeChanges> =
        new EventEmitter<PatientChartNodeChanges>();

    @Output() onTemplateListNodeAdded: EventEmitter<PatientChartNode> =
        new EventEmitter<PatientChartNode>();

    templateTypeService: BaseTemplateTypeService

    templateTypeDataSource: any = {};

    templateListNode: any = {
        title: "",
        templateTypeId: "",
    };

    isTemplateListNodeFormShown: boolean = false;

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private injector: Injector) {
    }

    ngOnInit() {
        this.initTemplateTypeService(this.isLibraryManagement, this.injector);
        this.setupTemplateListNode();
        this.initTemplateTypeDataSource(this.isLibraryManagement);
    }

    get isEditMode(): boolean {
        const actionType =
            this.patientChartContextMenuAction.actionType;

        return actionType === PatientChartContextMenuActionTypes.EditTemplateList;
    }

    createUpdateTemplateListNode() {
        const validationResult = this.templateListNodeForm
            .instance.validate();

        if (!validationResult.isValid)
            return;

        const newTemplateListNodeTitle = this.templateListNode.title;
        const selectedTemplateTypeId = this.templateListNode.templateTypeId;

        this.templateTypeService.getById(selectedTemplateTypeId)
            .then(templateType => {
                if (this.isEditMode)
                    this.processTemplateNodeEditing(newTemplateListNodeTitle,
                        templateType, this.patientChartContextMenuAction.patientChartTreeItem);
                else
                    this.processSectionNodeAdding(newTemplateListNodeTitle, templateType);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private setupTemplateListNode() {
        if (this.isEditMode) {
            const templateTypeName =
                this.patientChartContextMenuAction
                    .patientChartTreeItem.name;

            this.templateTypeService.getByName(templateTypeName, this.companyId)
                .then(templateType => {
                    this.templateListNode.templateTypeId = templateType.id;
                    this.templateListNode.title = this.patientChartContextMenuAction
                        .patientChartTreeItem.text;

                    this.isTemplateListNodeFormShown = true;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
        else
            this.isTemplateListNodeFormShown = true;
    }

    private initTemplateTypeDataSource(isLibraryManagement: boolean) {
        const templateTypeUrl = isLibraryManagement
            ? ApiBaseUrls.libraryTemplateTypes
            : ApiBaseUrls.templateTypes;

        this.templateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(templateTypeUrl),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    if (!this.isLibraryManagement)
                        jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private processSectionNodeAdding(newTemplateListNodeTitle: string, templateType: TemplateType) {
        const newTemplateListNodeParentId = this.patientChartContextMenuAction
            .patientChartTreeItem.id;

        const newTemplateListNodeId =
            GuidHelper.generateNewGuid();

        const nodeSpecificAttributes = {
            templateTypeId: templateType.id
        }

        const newTemplateListNodeAttributes =
            PatientChartNodeAttributes.createPatientChartNodeAttributes(0, true, false, false, false, nodeSpecificAttributes);
        newTemplateListNodeAttributes.isActive = true;

        newTemplateListNodeAttributes.nodeSpecificAttributes =
            nodeSpecificAttributes;

        const newTemplateListNode = PatientChartNode
            .createPatientChartTemplateListNode(newTemplateListNodeId,
                templateType.name, newTemplateListNodeTitle,
                newTemplateListNodeAttributes, newTemplateListNodeParentId);

        this.onTemplateListNodeAdded
            .next(newTemplateListNode);
    }

    private processTemplateNodeEditing(newTemplateListNodeTitle: string,
        templateType: TemplateType, templateListNode: PatientChartAdminNode) {
        const templateListNodeChanges =
            new PatientChartNodeChanges();

        templateListNodeChanges.nodeId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        const templateTypeName = templateType.name;

        const newNodeAttributes = PatientChartNodeAttributes
            .createPatientChartNodeAttributes(templateListNode.order,
                templateListNode.isActive, false, false, templateListNode.isPredefined, {
                templateTypeId: templateType.id
            });

        templateListNodeChanges.changes = {
            title: newTemplateListNodeTitle,
            name: templateTypeName,
            template: PatientChartNodeTemplateProviderService
                .getTemplateValueForPatientChartTemplateListNode(templateTypeName),
            attributes: newNodeAttributes
        };

        this.onTemplateListNodeEdited.next(templateListNodeChanges);
    }

    private initTemplateTypeService(isLibraryManagement: boolean, injector: Injector) {
        this.templateTypeService = injector.get(isLibraryManagement ? LibraryTemplateTypeService : TemplateTypeService)
    }
}