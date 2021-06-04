import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { PatientChartContextMenuActionItem } from 'src/app/administration/classes/patientChartContextMenuActionItem';
import { PatientChartContextMenuActions } from 'src/app/administration/classes/patientChartContextMenuActions';
import { PatientChartService } from 'src/app/patientChart/services/patient-chart.service';
import { PatientChartSectionService } from 'src/app/administration/services/patient-chart-section.service';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { PatientChartTreeItemType } from 'src/app/administration/classes/patientChartTreeItemType';

@Component({
    selector: "chart-section-management",
    templateUrl: "chart-section-management.component.html"
})
export class ChartSectionManagementComponent implements OnInit {
    @ViewChild("sectionForm", { static: false }) sectionForm: DxFormComponent;

    @Input() patientChartContextMenuActionItem: PatientChartContextMenuActionItem;
    @Input() patientChartTree: any;

    @Output() onPatientChartChanged: EventEmitter<string>
        = new EventEmitter();

    section: any = {
        title: ""
    };

    constructor(private patientChartService: PatientChartService,
        private entityNameService: EntityNameService) {
    }

    ngOnInit() {
        const action =
            this.patientChartContextMenuActionItem.action;

        if (action === PatientChartContextMenuActions.EditSection) {
            this.section = {
                id: this.patientChartContextMenuActionItem.patientChartTreeItem.id,
                title: this.patientChartContextMenuActionItem.patientChartTreeItem.text,
                name: this.patientChartContextMenuActionItem.patientChartTreeItem.name
            }
        }
    }

    createUpdateSection() {
        const validationResult = this.sectionForm.instance
            .validate();

        if (!validationResult.isValid)
            return;

        const isUpdateAction = !!this.section.id;
        if (isUpdateAction)
            this.updateSection();
        else
            this.addNewSection()
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        const patientChartSectionService =
            new PatientChartSectionService(this.patientChartService, this.patientChartTree);

        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, patientChartSectionService, "")
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.section.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    private addNewSection() {
        const itemType = this.patientChartContextMenuActionItem
            .patientChartTreeItem.itemType;

        let parentSectionId = "";

        if (itemType === PatientChartTreeItemType.Section)
            parentSectionId = this.patientChartContextMenuActionItem.patientChartTreeItem.id;
        else
            parentSectionId = this.patientChartContextMenuActionItem
                .patientChartTreeItem.parentPatientChartTreeItemId;

        const parentSection = this.patientChartService
            .getPatientChartSectionById(parentSectionId, this.patientChartTree.patientRoot);

        const newSection = this.patientChartService
            .createPatientChartSection(parentSectionId, this.section.name, this.section.title, {});

        parentSection.children.push(newSection);

        this.onPatientChartChanged.next(parentSectionId);
    }

    private updateSection() {
        const sectionId = this.patientChartContextMenuActionItem
            .patientChartTreeItem.id;

        const section = this.patientChartService
            .getPatientChartSectionById(sectionId, this.patientChartTree.patientRoot);

        section.name = this.section.name;
        section.title = this.section.title;

        this.onPatientChartChanged.next(sectionId);
    }
}