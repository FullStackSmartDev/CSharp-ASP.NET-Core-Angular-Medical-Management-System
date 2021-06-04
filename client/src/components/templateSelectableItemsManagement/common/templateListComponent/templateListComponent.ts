import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxListComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { BaseComponent } from '../../../baseComponent';
import { DataService } from '../../../../provider/dataService';
import { ToastService } from '../../../../provider/toastService';
import { PatientDataModelTrackService } from '../../../../provider/patientDataModelTrackService';
import { PatienDataModelService } from '../../../../provider/patienDataModelService';
import { TableNames } from '../../../../constants/tableNames';
import { StringHelper } from '../../../../helpers/stringHelper';
import { TemplateSectionModel } from '../../../../dataModels/templateSectionModel';

@Component({
    templateUrl: 'templateListComponent.html',
    selector: 'template-list-component'
})

export class TemplateListComponent extends BaseComponent implements OnInit {
    @Input("isSignedOff") isSignedOff: boolean;
    @Input() templateType: string = "";
    @Input() patientAdmissionSection: any = {};

    @ViewChild("templateList") templateList: DxListComponent;

    templatesDataSource: any = {};
    templates: Array<TemplateSectionModel> = [];

    selectedTemplateId: string = "";

    selectedTemplateOrderNumber: number = 0;
    oldSelectedTemplateOrderNumber: number = 0;

    availableOrderNumbers: Array<number> = [];

    constructor(dataService: DataService,
        toastService: ToastService,
        private patientDataModelTrackService: PatientDataModelTrackService,
        private patienDataModelService: PatienDataModelService) {
        super(dataService, toastService);
    }

    ngOnInit() {
        if (this.patientAdmissionSection) {
            this.templates = this.patientAdmissionSection.value;
        }
        const self = this;
        this.templatesDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.dataService
                    .getById(TableNames.template, key);
            },
            load: function (loadOptions: any) {
                const searchString = loadOptions.searchValue;
                return self.dataService
                    .getTemplatesByType(searchString, self.templateType, []);
            }
        });
    }

    onTemplateAdded($event) {
        const selectedTemplate = $event.itemData;
        if (selectedTemplate) {
            this.selectedTemplateId = selectedTemplate.Id;

            const newlyCreatedSectionId = this.dataService
                .generateGuid();
            selectedTemplate.SectionId = newlyCreatedSectionId;

            const order = selectedTemplate.TemplateOrder;
            selectedTemplate.Order = order;

            this.templates.push(selectedTemplate);

            const templatesSection = this.patientAdmissionSection;
            const templatesSectionId = templatesSection.id;

            const childrenSectionAttributes = {
                order: order
            };

            let childrenSection = this.patienDataModelService
                .createPatientAdmissionTemplateSection(templatesSectionId,
                    this.templateType, selectedTemplate.Name,
                    selectedTemplate.ReportTitle, childrenSectionAttributes, newlyCreatedSectionId);

            templatesSection.children.push(childrenSection);

            this.adjustTemplatesOrder();

            this.patientDataModelTrackService.emitPatientDataModelChanges(true);

            this.selectedTemplateId = "";

            const successfullyAddedPlanMessage = StringHelper
                .format("{0} template was successfully added.",
                    selectedTemplate.Title);

            this.toastService
                .showSuccessMessage(successfullyAddedPlanMessage);
        }
    }

    onTemplateDeleted($event) {
        const templateToDelete = $event.itemData;
        if (!templateToDelete) {
            return;
        }
        const templateSectionIdToDelete =
            templateToDelete.SectionId;

        const alreadyExistedTemplatesInSection =
            this.patientAdmissionSection.children;

        if (alreadyExistedTemplatesInSection.length > 0) {

            let templateSectionIndexToDelete = -1;
            for (let i = 0; i < alreadyExistedTemplatesInSection.length; i++) {
                const templateSection = alreadyExistedTemplatesInSection[i];
                if (templateSectionIdToDelete === templateSection.id) {
                    templateSectionIndexToDelete = i;
                    break;
                }
            }

            if (templateSectionIndexToDelete !== -1) {
                alreadyExistedTemplatesInSection
                    .splice(templateSectionIndexToDelete, 1);
            }

            let templateIndexToDelete = -1;
            const templates = this.templates;
            const templateIdToDelete = templateToDelete.Id;

            for (let i = 0; i < templates.length; i++) {
                const template = templates[i];
                if (templateIdToDelete === template.Id) {
                    templateIndexToDelete = i;
                    break;
                }
            }

            if (templateIndexToDelete !== -1) {
                templates.splice(templateIndexToDelete, 1);
            }

            this.adjustTemplatesOrder();

            this.patientDataModelTrackService.emitPatientDataModelChanges(true);

            const successfullyDeletedPlanMessage = StringHelper
                .format("{0} template was successfully deleted.", templateToDelete.Title);

            this.toastService.showSuccessMessage(successfullyDeletedPlanMessage);
        }
    }

    private adjustTemplatesOrder() {
        this.templates
            .sort((t1, t2) => t1.Order - t2.Order);
        this.patientAdmissionSection.children
            .sort((s1, s2) => s1.attributes.order - s2.attributes.order);
    }
}
