import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxListComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { TemplateSection } from 'src/app/patientChart/models/templateSection';
import { PatientChartTrackService } from '../../../../_services/patient-chart-track.service';
import { PatientChartService } from 'src/app/patientChart/services/patient-chart.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    templateUrl: 'template-list.component.html',
    selector: 'template-list'
})

export class TemplateListComponent implements OnInit {
    @Input() isSignedOff: boolean;
    @Input() companyId: string;
    @Input() templateType: string = "";
    @Input() patientChartSection: any = {};

    @ViewChild("templateList", { static: false }) templateList: DxListComponent;
    @ViewChild("templateSelectBox", { static: false }) templateSelectBox: DxSelectBoxComponent;

    templateDataSource: any = {};
    templates: Array<TemplateSection> = [];

    selectedTemplateOrderNumber: number = 0;
    oldSelectedTemplateOrderNumber: number = 0;

    availableOrderNumbers: Array<number> = [];

    constructor(private patientChartTrackService: PatientChartTrackService,
        private patienChartService: PatientChartService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private templateTypeService: TemplateTypeService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.patientChartSection) {
            this.templates = this.patientChartSection.value;
        }

        if (!this.isSignedOff)
            this.initTemplateDataSource();
    }

    onTemplateAdded($event) {
        const selectedTemplate = $event.itemData;
        if (selectedTemplate) {
            const newlyCreatedSectionId = GuidHelper.generateNewGuid();
            selectedTemplate.sectionId = newlyCreatedSectionId;

            const order = selectedTemplate.templateOrder;
            selectedTemplate.order = order;

            this.templates.push({
                id: selectedTemplate.id,
                title: selectedTemplate.reportTitle,
                name: selectedTemplate.name,
                order: order,
                sectionId: newlyCreatedSectionId
            });

            const templatesSection = this.patientChartSection;
            const templatesSectionId = templatesSection.id;

            const childrenSectionAttributes = {
                order: order
            };

            let childrenSection = this.patienChartService
                .createPatientChartTemplateSection(templatesSectionId, this.templateType,
                    selectedTemplate, childrenSectionAttributes, newlyCreatedSectionId);

            if (!templatesSection.children)
                templatesSection.children = [];

            templatesSection.children.push(childrenSection);

            this.adjustTemplatesOrder();

            this.patientChartTrackService.emitPatientChartChanges(true);

            this.templateSelectBox.value = undefined;
        }
    }

    onTemplateDeleted($event) {
        const templateToDelete = $event.itemData;
        if (!templateToDelete) {
            return;
        }
        const templateSectionIdToDelete =
            templateToDelete.sectionId;

        const alreadyExistedTemplatesInSection = this.patientChartSection.children;

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
                if (templateIdToDelete === template.id) {
                    templateIndexToDelete = i;
                    break;
                }
            }

            if (templateIndexToDelete !== -1) {
                templates.splice(templateIndexToDelete, 1);
            }

            this.adjustTemplatesOrder();

            this.patientChartTrackService.emitPatientChartChanges(true);
        }
    }

    private initTemplateDataSource(): void {
        this.templateTypeService.getByName(this.templateType, this.companyId)
            .then(templateType => {
                const templateDataSource = {
                    store: createStore({
                        loadUrl: this.dxDataUrlService.getLookupUrl("template"),
                        onBeforeSend: this.devextremeAuthService
                            .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                                jQueryAjaxSettings.data.templateTypeId = templateType.id;
                                jQueryAjaxSettings.data.companyId = this.companyId;
                            }, this)
                    })
                }

                this.templateSelectBox.instance.option("dataSource", templateDataSource);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private adjustTemplatesOrder() {
        this.templates
            .sort((t1, t2) => t1.order - t2.order);
        this.patientChartSection.children
            .sort((s1, s2) => s1.attributes.order - s2.attributes.order);
    }
}
