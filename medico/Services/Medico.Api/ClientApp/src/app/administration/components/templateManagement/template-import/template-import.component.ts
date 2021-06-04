import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { LibraryTemplateService } from 'src/app/administration/services/library/library-template.service';
import { AlertService } from 'src/app/_services/alert.service';
import { TemplateSearchFilter } from 'src/app/administration/models/TemplateSearchFilter';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { TemplateGridItem } from 'src/app/_models/templateGridItem';
import { TemplateService } from 'src/app/_services/template.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';

@Component({
    selector: "template-import",
    templateUrl: "./template-import.component.html"
})
export class TemplateImportComponent implements OnInit {
    @Input() companyId: string;

    @Output() onTemplatesImportApplied: EventEmitter<void> =
        new EventEmitter<void>();

    @Output() onTemplatesImportCanceled: EventEmitter<void> =
        new EventEmitter<void>();

    templateTypeId: string = "";
    templateTypeDataSource: any = {};

    templates: TemplateGridItem[] = [];
    selectedTemplates: TemplateGridItem[] = [];

    constructor(private libraryTemplateService: LibraryTemplateService,
        private alertService: AlertService,
        private templateService: TemplateService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    ngOnInit() {
        this.initTemplateTypeDataSource();
    }

    onTemplateTypeChanged($event) {
        const templateTypeId = $event.value;
        if (!templateTypeId)
            return;

        this.templateTypeId = templateTypeId;
        this.loadLibraryTemplates();
    }

    cancelTemplateImporting() {
        this.onTemplatesImportCanceled.next();
    }

    importSelectedTemplates() {
        if (!this.selectedTemplates.length) {
            this.alertService.warning("You haven't selected any templates");
            return;
        }

        const selectedTemplateIds = this.selectedTemplates
            .map(t => t.id);

        this.templateService.importLibraryTemplates(this.companyId,
            this.templateTypeId, selectedTemplateIds)
            .then(() => {
                this.onTemplatesImportApplied.next();
            });
    }

    private initTemplateTypeDataSource() {
        this.templateTypeDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.libraryTemplateTypes),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private loadLibraryTemplates() {
        const templateSearchFilter = new TemplateSearchFilter();
        templateSearchFilter.templateTypeId = this.templateTypeId;
        templateSearchFilter.companyId = this.companyId;
        templateSearchFilter.excludeImported = true;

        this.libraryTemplateService
            .getByFilter(templateSearchFilter)
            .then(templates => {
                this.templates = templates;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}