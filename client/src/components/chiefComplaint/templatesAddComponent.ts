import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { ChiefComplaintTemplateDataService, TemplateDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { TemplateTypeIds } from '../../constants/templateType';

@Component({
    templateUrl: 'templatesAddComponent.html',
    selector: 'templates-add'
})

export class TemplatesAddComponent implements AfterViewInit {
    @Input("chiefComplaintId") chiefComplaintId: string;

    @Output() onTemplatesAdded: EventEmitter<Array<any>>
        = new EventEmitter();

    @Output() onTemplatesCanceled: EventEmitter<Array<any>>
        = new EventEmitter();

    @ViewChild("addTemplatesPopup") addTemplatesPopup: DxPopupComponent;

    templates: any = { hpi: [], pe: [], ros: [] };

    constructor(private chiefComplaintTemplateDataService: ChiefComplaintTemplateDataService,
        private templateDataService: TemplateDataService) {
    }

    get areMappedTemplatesExist(): boolean {
        return this.templates.pe.length
            || this.templates.ros.length
            || this.templates.hpi.length;
    }

    addTemplates() {
        this.onTemplatesAdded.next(this.templates);
        this.resetTemplates();
    }

    cancelAddingTemplates() {
        this.onTemplatesCanceled.next();
        this.resetTemplates();
    }

    ngAfterViewInit(): void {
        this.addTemplatesPopup
            .instance
            .show();
        
        this.loadTemplates()
    }

    private loadTemplates(): void {
        this.getChiefComplainTemplateIds()
            .then(templateIds => {
                if (!templateIds.length) {
                    return Promise.resolve([]);
                }
                return this.getTemplatesByIds(templateIds);
            })
            .then(templates => {
                this.adjustTemplatesByType(templates);
            });
    }

    private getTemplatesByIds(templateIds: string[]) {
        const templatePormises = [];

        for (let i = 0; i < templateIds.length; i++) {
            const templateId = templateIds[i];
            const getTemplateByIdPromise =
                this.templateDataService.getById(templateId);

            templatePormises.push(getTemplateByIdPromise);
        }

        return Promise.all(templatePormises);
    }

    private getChiefComplainTemplateIds(): Promise<string[]> {
        const requestedFields = ["TemplateId"];
        const loadOptions = {
            filter: ["ChiefComplaintId", "=", this.chiefComplaintId]
        }

        return this.chiefComplaintTemplateDataService
            .search(loadOptions, requestedFields)
            .then(chiefComplaintTemplates => {
                return chiefComplaintTemplates
                    .map(c => c.TemplateId);
            });
    }

    private adjustTemplatesByType(templates: Array<any>) {
        const templatesGroupedByTemplateType =
            this.groupTemplatesByTemplateTypes(templates);
        if (templatesGroupedByTemplateType[TemplateTypeIds.pe]) {
            this.templates.pe =
                templatesGroupedByTemplateType[TemplateTypeIds.pe];
        }
        if (templatesGroupedByTemplateType[TemplateTypeIds.hpi]) {
            this.templates.hpi =
                templatesGroupedByTemplateType[TemplateTypeIds.hpi];
        }
        if (templatesGroupedByTemplateType[TemplateTypeIds.ros]) {
            this.templates.ros =
                templatesGroupedByTemplateType[TemplateTypeIds.ros];
        }
    }

    private groupTemplatesByTemplateTypes(templates: any[]): any {
        if (templates.length) {
            return ArrayHelper.groupBy(templates, "TemplateTypeId");
        }

        return {};
    }

    private resetTemplates() {
        this.templates = { hpi: [], pe: [], ros: [] };
    }
}
