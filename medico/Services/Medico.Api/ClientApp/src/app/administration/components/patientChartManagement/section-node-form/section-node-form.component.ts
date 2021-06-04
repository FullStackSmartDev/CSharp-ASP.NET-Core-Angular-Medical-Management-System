import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { PatientChartContextMenuAction } from 'src/app/administration/classes/patientChartContextMenuAction';
import { PatientChartContextMenuActionTypes } from 'src/app/administration/classes/patientChartContextMenuActionTypes';
import { PatientChartNodeChanges } from 'src/app/administration/classes/patientChartNodeChanges';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { PatientChartNodeAttributes } from 'src/app/_models/patientChartNodeAttributes';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

@Component({
    selector: "section-node-form",
    templateUrl: "section-node-form.html"
})
export class SectionNodeFormComponent implements OnInit {
    @ViewChild("sectionNodeForm", { static: false }) sectionForm: DxFormComponent;

    @Input() patientChartContextMenuAction: PatientChartContextMenuAction;

    @Output() onSectionNodeEdited: EventEmitter<PatientChartNodeChanges> =
        new EventEmitter<PatientChartNodeChanges>();

    @Output() onSectionNodeAdded: EventEmitter<PatientChartNode> =
        new EventEmitter<PatientChartNode>();

    sectionNode: any = {
        title: ""
    };

    constructor(private entityNameService: EntityNameService) {
    }

    ngOnInit() {
        this.setPatientChartSectionNode();
    }

    setPatientChartSectionNode() {
        if (this.isEditMode)
            this.sectionNode.title =
                this.patientChartContextMenuAction.patientChartTreeItem.text
    }

    get isEditMode(): boolean {
        const actionType =
            this.patientChartContextMenuAction.actionType;

        return actionType === PatientChartContextMenuActionTypes.EditSectionNode;
    }

    createUpdateSectionNode() {
        const validationResult = this.sectionForm.instance
            .validate();

        if (!validationResult.isValid)
            return;

        const newSectionNodeTitle = this.sectionNode.title;
        const newSectionNodeName = this.entityNameService
            .formatFromReadableEntityName(newSectionNodeTitle);

        if (this.isEditMode) {
            this.processSectionNodeEditing(newSectionNodeTitle, newSectionNodeName);
            return;
        }

        this.processSectionNodeAdding(newSectionNodeTitle, newSectionNodeName);
    }

    private processSectionNodeAdding(newSectionNodeTitle, newSectionNodeName) {
        const newSectionNodeId = GuidHelper.generateNewGuid();
        const newSectionNodeAttributes = new PatientChartNodeAttributes();
        newSectionNodeAttributes.isActive = true;

        const newSectionNodeParentId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        const newDocumentNode = PatientChartNode
            .createPatientChartNode(newSectionNodeId,
                newSectionNodeName, newSectionNodeTitle,
                PatientChartNodeType.SectionNode, null,
                newSectionNodeAttributes, newSectionNodeParentId, "");

        this.onSectionNodeAdded.next(newDocumentNode);
    }

    private processSectionNodeEditing(newSectionNodeTitle: string, newSectionNodeName: string) {
        const sectionNodeChanges =
            new PatientChartNodeChanges();

        sectionNodeChanges.nodeId =
            this.patientChartContextMenuAction.patientChartTreeItem.id;

        sectionNodeChanges.changes = {
            title: newSectionNodeTitle,
            name: newSectionNodeName
        };

        this.onSectionNodeEdited.next(sectionNodeChanges);
    }
}