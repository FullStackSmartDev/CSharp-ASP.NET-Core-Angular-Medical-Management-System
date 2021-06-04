import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { Component, Input, OnInit } from '@angular/core';
import { Template } from 'src/app/_models/template';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { TemplateService } from 'src/app/_services/template.service';
import { ChiefComplaintService } from 'src/app/_services/chief-complaint.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "template-type-mapping",
    templateUrl: "./template-type-mapping.component.html"
})
export class TemplateTypeMappingComponent extends BaseAdminComponent implements OnInit {
    @Input("chiefComplaintId") chiefComplaintId: string;
    @Input("templateTypeId") templateTypeId: string;
    @Input("companyId") companyId: string;

    templates: Template[] = [];
    templateDataSource: any = {}

    selectedTemplateId: string = "";


    constructor(private dxDataUrlService: DxDataUrlService,
        private templateService: TemplateService,
        private chiefComplaintService: ChiefComplaintService,
        private alertService: AlertService,
        private devextremeAuthService: DevextremeAuthService) {
        super();
    }

    getTemplateIdsToSave(): string[] {
        return this.templates.map(t => t.id);
    }

    addNewTemplate(): void {
        if (!this.selectedTemplateId)
            return;

        const existedTemplate = this.templates
            .filter(t => t.id === this.selectedTemplateId)[0];

        if (existedTemplate)
            return;

        this.templateService.getById(this.selectedTemplateId)
            .then(template => {
                this.templates.push(template);
                this.selectedTemplateId = "";
            });
    }

    ngOnInit(): void {
        this.loadChiefComplaintTemplates();
        this.initTemplateDataSource();
    }

    private initTemplateDataSource() {
        this.templateDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("template"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.templateTypeId = this.templateTypeId;
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private loadChiefComplaintTemplates() {
        if (!this.chiefComplaintId)
            return;

        this.chiefComplaintService.getChiefComplaintTemplatesByType(this.chiefComplaintId, this.templateTypeId)
            .then(templates => {
                if (templates && templates.length)
                    this.templates = templates;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}