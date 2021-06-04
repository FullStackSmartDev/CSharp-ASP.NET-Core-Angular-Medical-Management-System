import { Component, Input, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { IcdCodeService } from 'src/app/_services/icd-code.service';
import { AlertService } from 'src/app/_services/alert.service';
import { SearchConfiguration } from 'src/app/_classes/searchConfiguration';
import { IcdCode } from 'src/app/_models/icdCode';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { ChiefComplaintKeywordService } from 'src/app/_services/chief-complaint-keyword.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    templateUrl: 'appointment-allegations.component.html',
    selector: 'appointment-allegations'
})
export class AppointmentAllegationsComponent implements AfterViewInit, OnInit {
    @Input("allegationsString") allegationsString: string;

    @ViewChild("allegationForm", { static: false }) allegationForm: DxFormComponent;
    @ViewChild("allegationPopup", { static: false }) allegationPopup: DxPopupComponent;

    mappedIcdCodes: IcdCode[] = [];

    selectedAllegation: string = "";
    allegations: string[] = [];

    newAllegationIcdCodeMapping: any = {}

    searchConfiguration: SearchConfiguration = new SearchConfiguration();

    icdCodesDataSource: any = {};

    isAllegationPopupOpened: boolean = false;

    constructor(private icdCodeService: IcdCodeService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private chiefComplaintKeywordService: ChiefComplaintKeywordService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    ngAfterViewInit(): void {
        this.allegationPopup
            .instance
            .registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            });
    }

    ngOnInit(): void {
        this.setAllegations();
        this.initIcdCodeDataSource();
    }

    openMappingForm() {
        this.newAllegationIcdCodeMapping.keywordValue = this.selectedAllegation;
        this.isAllegationPopupOpened = true;
    }

    onAllegationPopupHidden() {
        this.newAllegationIcdCodeMapping = {};
    }

    onAllegationSelected($event) {
        let selectedAllegation = $event.addedItems[0];

        if (!selectedAllegation)
            return;

        selectedAllegation = selectedAllegation.trim();
        this.selectedAllegation = selectedAllegation;

        this.setMappedKeywords();
    }

    deleteMappedIcdCode(icdCode: any, $event: any) {
        $event.stopPropagation();
        this.alertService.confirm("Are you sure you want to delete icd code from mapping?", "Confirm deletion")
            .then(deleteConfirmation => {
                if (deleteConfirmation) {
                    const icdCodeId = icdCode.id;

                    this.icdCodeService.deleteIcdCodeMapping(this.selectedAllegation, icdCodeId)
                        .then(() => {
                            this.setMappedKeywords();
                        })
                        .catch(error => this.alertService.error(error.message ? error.message : error));
                }
            });
    }

    setAllegations() {
        this.allegations = this.allegationsString
            ? this.allegationsString.split(",")
            : [];
    }

    createAllegationIcdCodeMapping() {
        const validationResult = this.allegationForm.instance.validate();

        if (!validationResult.isValid) {
            return;
        }

        this.chiefComplaintKeywordService.createIcdCodeMap(this.newAllegationIcdCodeMapping.keywordValue,
            this.newAllegationIcdCodeMapping.icdCodeId)
            .then(() => {
                this.setMappedKeywords();
                this.newAllegationIcdCodeMapping = {};
                this.isAllegationPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    validateMappingExistence = (params) => {
        const icdCodeId = params.value;

        this.icdCodeService.checkMappingExistence(icdCodeId, this.selectedAllegation)
            .then(isMappingExist => {
                params.rule.isValid = !isMappingExist;
                params.rule.message = "The icd code already mapped to allegation";

                params.validator.validate();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

        return false;
    }

    private initIcdCodeDataSource(): void {
        this.icdCodesDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("icdcode"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private setMappedKeywords() {
        this.icdCodeService.getMappedToKeword(this.selectedAllegation)
            .then(mappedIcdCodes => {
                this.mappedIcdCodes = mappedIcdCodes;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}