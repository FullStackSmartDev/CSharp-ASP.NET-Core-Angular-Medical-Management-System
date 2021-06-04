import { Component, Input } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ChiefComplaint } from 'src/app/_models/chiefComplaint';
import { AlertService } from 'src/app/_services/alert.service';
import { ChiefComplaintService } from 'src/app/_services/chief-complaint.service';

@Component({
    selector: "existed-template-mapping",
    templateUrl: "existed-template-mapping.component.html"
})
export class ExistedTemplateMappingComponent {
    @Input() companyId: string;
    @Input() allegations: string;

    chiefComplaintDataSource: any = {};
    selectedChiefComplaintId: string = "";

    mapping: any = {
        chiefComplaint: new ChiefComplaint()
    }

    constructor(private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService,
        private alertService: AlertService,
        private chiefComplaintService: ChiefComplaintService) {

        this.initChiefComplaintDataSource();
    }

    get isChiefComplaintSelected(): boolean {
        return !!this.selectedChiefComplaintId;
    }

    onTemplateKeywordMappingSaved() {
        this.alertService.info("Mapping was successfully created");
        this.switchToChiefComplainSearch();
    }

    switchToChiefComplainSearch() {
        this.selectedChiefComplaintId = "";
        this.mapping = {
            chiefComplaint: new ChiefComplaint()
        }
    }

    onChiefComplaintChanged($event) {
        const selectedChiefComplaintId = $event.value;
        if (!selectedChiefComplaintId)
            return;

        this.chiefComplaintService.getById(selectedChiefComplaintId)
            .then((chiefComplaint) => {
                this.mapping.chiefComplaint = chiefComplaint;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initChiefComplaintDataSource() {
        this.chiefComplaintDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.chiefComplaint),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }
}