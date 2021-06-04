import { Component, Input, OnInit, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { PatientChartContextMenuAction } from 'src/app/administration/classes/patientChartContextMenuAction';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { DxFormComponent } from 'devextreme-angular';
import { BasePatientChartDocumentService } from "src/app/_services/base-patient-chart-document.service";
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartContextMenuActionTypes } from 'src/app/administration/classes/patientChartContextMenuActionTypes';
import { PatientChartNodeChanges } from 'src/app/administration/classes/patientChartNodeChanges';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { PatientChartNodeAttributes } from 'src/app/_models/patientChartNodeAttributes';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { PatientChartDocumentService } from 'src/app/_services/patient-chart-document.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { LibraryPatientChartDocumentService } from 'src/app/_services/library-patient-chart-document.service';
import { PatientChartSearchFilter } from 'src/app/administration/models/patientChartSearchFilter';
import { PatientChartDocumentWithVersion } from 'src/app/_models/patientChartDocumentWithVersion';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    selector: "document-node-form",
    templateUrl: "document-node-form.html"
})
export class DocumentNodeFormComponent implements OnInit {
    @ViewChild("patientChartDocumentForm", { static: false }) patientChartDocumentForm: DxFormComponent;

    @Input() patientChartContextMenuAction: PatientChartContextMenuAction;
    @Input() companyId: string;
    @Input() isLibraryManagement: boolean;
    @Input() patientChartRootId: string;

    patientChartDocumentService: BasePatientChartDocumentService;

    @Output() onDocumentNodeEdited: EventEmitter<PatientChartNodeChanges> =
        new EventEmitter<PatientChartNodeChanges>();

    @Output() onDocumentNodeAdded: EventEmitter<PatientChartNode> =
        new EventEmitter<PatientChartNode>();

    @Output() onDocumentNodeSynchronized: EventEmitter<void> =
        new EventEmitter<void>();

    patientChartDocumentsDataSource: any = {};

    isDocumentNodeFormShown: boolean = false;

    patientChartDocumentNode: any = {
        title: "",
        isBasedOn: false,
        basedOnDocumentId: ""
    }

    documentsToImport: any[] = [];
    selectedDocumentsToImport: any[] = [];

    patientChartDocumentWithVersion: PatientChartDocumentWithVersion;

    private _importMode: boolean = false;

    get importMode(): boolean {
        return this._importMode;
    }

    set importMode(value: boolean) {
        this._importMode = value;
        if (!value)
            this.resetDocumentsToImport();
        else {
            this.resetPatientChartDocumentNode();
            this.loadDocumentsToImport();
        }
    }

    constructor(private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private entityNameService: EntityNameService,
        private injector: Injector,
        private alertService: AlertService) {
    }

    get isEditMode(): boolean {
        const actionType =
            this.patientChartContextMenuAction.actionType;

        return actionType === PatientChartContextMenuActionTypes.EditDocumentNode;
    }

    get isPatientChartDocumentSyncIconVisible(): boolean {
        return !!(this.isEditMode && this.patientChartDocumentWithVersion
            && this.patientChartDocumentWithVersion.libraryPatientChartDocumentNodeId);
    }

    syncWithLibraryDocument() {
        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to sync document ?", "Confirm sync");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                const patientChartDocumentService =
                    <PatientChartDocumentService>this.patientChartDocumentService;

                patientChartDocumentService
                    .syncWithLibraryDocument(this.patientChartDocumentWithVersion.id,
                        this.patientChartDocumentWithVersion.version, this.patientChartRootId)
                    .then(() => {
                        this.onDocumentNodeSynchronized.next();
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    importSelectedDocuments() {
        const patientChartDocumentService =
            <PatientChartDocumentService>this.patientChartDocumentService;

        const selectedPatientChartLibraryDocumentIds =
            this.selectedDocumentsToImport.map(d => d.id);

        const patientChartRootNodeId = this.patientChartContextMenuAction
            .patientChartTreeItem.id;

        patientChartDocumentService
            .importLibraryDocumentNodes(this.companyId, selectedPatientChartLibraryDocumentIds, patientChartRootNodeId)
            .then(patientChartDocuments => {
                patientChartDocuments.forEach(patientChartDocument => {
                    this.onDocumentNodeAdded.next(patientChartDocument);
                });
            })
    }

    cancelImporting() {
        this.importMode = false;
    }

    validateTitleExistence = (params) => {
        const patientChartDocumentTitle = params.value;

        this.patientChartDocumentService.getByTitle(patientChartDocumentTitle, this.companyId)
            .then(patientChartDocument => {
                const isPatientChartDocumentValid =
                    !patientChartDocument || this.patientChartDocumentNode.id === patientChartDocument.id

                params.rule.isValid = isPatientChartDocumentValid;
                params.rule.message = `Document with title '${patientChartDocumentTitle}' already exists`;

                params.validator.validate();
            })

        return true;
    }

    ngOnInit() {
        this.initPatientChartDocumentService(this.isLibraryManagement, this.injector);
        this.setPatientChartDocumentNode();
        this.initPatientChartDocumentsDataSource(this.isLibraryManagement);
    }

    createPatientChartDocument() {
        const validationResult = this.patientChartDocumentForm
            .instance.validate();

        if (!validationResult.isValid)
            return;

        const newDocumentNodeTitle = this.patientChartDocumentNode.title;
        const newDocumentNodeName = this.entityNameService
            .formatFromReadableEntityName(newDocumentNodeTitle);

        if (this.isEditMode) {
            this.processDocumentNodeEditing(newDocumentNodeTitle, newDocumentNodeName);
            return;
        }

        this.processDocumentNodeAdding(newDocumentNodeTitle, newDocumentNodeName);
    }

    private processDocumentNodeAdding(newDocumentNodeTitle: string, newDocumentNodeName: string) {
        const isBasedOnCreation =
            this.patientChartDocumentNode.isBasedOn;

        const newDocumentNodeParentId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        if (isBasedOnCreation)
            this.patientChartDocumentService
                .getPatientChartDocumentCopy(this.patientChartDocumentNode.basedOnDocumentId)
                .then((patientChartDocumentNode: PatientChartNode) => {
                    patientChartDocumentNode.title = newDocumentNodeTitle;
                    patientChartDocumentNode.parentId = newDocumentNodeParentId;
                    patientChartDocumentNode.name = newDocumentNodeName;

                    this.onDocumentNodeAdded.next(patientChartDocumentNode);
                });
        else {
            const newDocumentNodeId = GuidHelper.generateNewGuid();
            const newDocumentNodeAttributes = new PatientChartNodeAttributes();
            newDocumentNodeAttributes.isActive = true;

            const newDocumentNode = PatientChartNode
                .createPatientChartNode(newDocumentNodeId,
                    newDocumentNodeName, newDocumentNodeTitle,
                    PatientChartNodeType.DocumentNode, null,
                    newDocumentNodeAttributes, newDocumentNodeParentId, "");

            this.onDocumentNodeAdded.next(newDocumentNode);
        }
    }

    private processDocumentNodeEditing(newDocumentNodeTitle: string, newDocumentNodeName: string) {
        const documentNodeChanges =
            new PatientChartNodeChanges();

        documentNodeChanges.nodeId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        documentNodeChanges.changes = {
            title: newDocumentNodeTitle,
            name: newDocumentNodeName
        };

        this.onDocumentNodeEdited.
            next(documentNodeChanges);
    }

    private initPatientChartDocumentsDataSource(isLibraryManagement: boolean) {
        const patientChartDocumentsUrl = isLibraryManagement
            ? ApiBaseUrls.libraryPatientChartDocuments
            : ApiBaseUrls.patientChartDocuments;

        this.patientChartDocumentsDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(patientChartDocumentsUrl),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    if (!isLibraryManagement)
                        jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private setPatientChartDocumentNode() {
        if (this.isEditMode) {
            if (!this.companyId) {
                this.patientChartDocumentNode.title =
                    this.patientChartContextMenuAction.patientChartTreeItem.text;
                this.isDocumentNodeFormShown = true;
            }
            else {
                this.patientChartDocumentNode.title =
                    this.patientChartContextMenuAction.patientChartTreeItem.text;

                (<PatientChartDocumentService>this.patientChartDocumentService)
                    .getByIdWithFilter(this.patientChartContextMenuAction.patientChartTreeItem.id)
                    .then(patientChartDocument => {
                        this.patientChartDocumentWithVersion = patientChartDocument;
                        this.isDocumentNodeFormShown = true;
                    })
            }
        }
        else
            this.isDocumentNodeFormShown = true;
    }

    private initPatientChartDocumentService(isLibraryManagement: boolean, injector: Injector) {
        this.patientChartDocumentService = injector
            .get(isLibraryManagement ? LibraryPatientChartDocumentService : PatientChartDocumentService);
    }

    private resetDocumentsToImport() {
        this.documentsToImport = [];
        this.selectedDocumentsToImport = [];
    }

    private resetPatientChartDocumentNode() {
        this.patientChartDocumentNode = {
            title: "",
            isBasedOn: false,
            basedOnDocumentId: ""
        }
    }

    private loadDocumentsToImport() {
        const templateSearchFilter = new PatientChartSearchFilter();
        templateSearchFilter.companyId = this.companyId;
        templateSearchFilter.excludeImported = true;

        this.patientChartDocumentService
            .getByFilter(templateSearchFilter)
            .then(patientChartDocuments => {
                this.documentsToImport = patientChartDocuments;
            });
    }
}