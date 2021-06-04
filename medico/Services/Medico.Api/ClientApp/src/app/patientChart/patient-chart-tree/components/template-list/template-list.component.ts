import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxListComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { PatientChartTrackService } from '../../../../_services/patient-chart-track.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';
import { AlertService } from 'src/app/_services/alert.service';
import { TemplateNodeInfo } from 'src/app/patientChart/models/templateNodeInfo';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { TemplateService } from 'src/app/_services/template.service';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

@Component({
    templateUrl: 'template-list.component.html',
    selector: 'template-list'
})

export class TemplateListComponent implements OnInit {
    @Input() isSignedOff: boolean;
    @Input() companyId: string;
    @Input() templateType: string = "";
    @Input("patientChartNode") patientChartTemplateListNode: any = {};

    @ViewChild("templateList", { static: false }) templateList: DxListComponent;
    @ViewChild("templateSelectBox", { static: false }) templateSelectBox: DxSelectBoxComponent;

    templateDataSource: any = {};
    templates: Array<TemplateNodeInfo> = [];

    selectedTemplateOrderNumber: number = 0;
    oldSelectedTemplateOrderNumber: number = 0;

    availableOrderNumbers: Array<number> = [];

    constructor(private patientChartTrackService: PatientChartTrackService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private templateTypeService: TemplateTypeService,
        private alertService: AlertService,
        private templateService: TemplateService) {
    }

    ngOnInit() {
        if (this.patientChartTemplateListNode)
            this.templates =
                this.patientChartTemplateListNode.value;

        if (!this.isSignedOff)
            this.initTemplateDataSource();
    }

    onTemplateAdded($event) {
        const selectedTemplate = $event.itemData;
        if (selectedTemplate) {
            const selectedTemplateId = selectedTemplate.id;

            this.templateService.getById(selectedTemplateId)
                .then(template => {
                    const newlyCreatedNodeId = GuidHelper.generateNewGuid();

                    const templateNodeInfo =
                        new TemplateNodeInfo(template.id,
                            template.templateOrder, template.reportTitle, newlyCreatedNodeId);

                    this.templates.push(templateNodeInfo);

                    const templateListNodeId =
                        this.patientChartTemplateListNode.id;

                    let childTemplateNode = PatientChartNode
                        .createPatientChartTemplateNode(newlyCreatedNodeId,
                            templateListNodeId, template, this.templateType)

                    if (!this.patientChartTemplateListNode.children)
                        this.patientChartTemplateListNode.children = [];

                    this.patientChartTemplateListNode.children.push(childTemplateNode);

                    this.adjustTemplatesOrder();

                    this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.TemplateListNode);

                    this.templateSelectBox.value = undefined;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    onTemplateDeleted($event) {
        const templateToDelete = $event.itemData;
        if (!templateToDelete) {
            return;
        }
        const templateSectionIdToDelete =
            templateToDelete.sectionId;

        const alreadyExistedTemplatesInSection =
            this.patientChartTemplateListNode.children;

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

            this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.TemplateListNode);
        }
    }

    private initTemplateDataSource(): void {
        this.templateTypeService.getByName(this.templateType, this.companyId)
            .then(templateType => {
                //the template type can be deleted and is not exist anymore
                if (!templateType)
                    return;

                const templateDataSource = {
                    store: createStore({
                        loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.templates),
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
        this.patientChartTemplateListNode.children
            .sort((s1, s2) => s1.attributes.order - s2.attributes.order);
    }
}
