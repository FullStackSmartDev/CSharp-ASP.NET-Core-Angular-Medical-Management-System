import { Component, Input, ViewChild } from "@angular/core";
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { ChiefComplaintKeyword } from 'src/app/_models/chiefComplaintKeyword';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { ChiefComplaintKeywordService } from 'src/app/_services/chief-complaint-keyword.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "keyword-icd-code-mapping",
    templateUrl: "./keyword-icd-code-mapping.component.html"
})
export class KeywordIcdCodeMappingComponent extends BaseAdminComponent {
    @Input("companyId") companyId;

    @ViewChild("codeKeywordsDataGrid", { static: false }) codeKeywordsDataGrid: DxDataGridComponent;
    @ViewChild("codeKeywordsPopup", { static: false }) codeKeywordsPopup: DxPopupComponent;
    @ViewChild("codeKeywordsForm", { static: false }) codeKeywordsForm: DxFormComponent;

    isNewCodeKeywordsMapping: boolean = true;
    keywordIcdCodes: any;

    icdCodeKeywordsDataSource: any = {};
    icdCodesDataSource: any = {};

    codeKeywordsFormData: any = {};
    keywords: ChiefComplaintKeyword[] = [];

    selectedCodes: Array<any> = [];

    isCodeKeywordsPopupOpened: boolean = false;

    constructor(private chiefComplaintKeywordService: ChiefComplaintKeywordService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {

        super();

        this.init();
    }

    saveCodeKeywords() {
        const validationResult = this.codeKeywordsForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (!this.isNewCodeKeywordsMapping) {
            this.isCodeKeywordsPopupOpened = false;
            return;
        }

        const saveCodeKeywordPromises = [];

        for (let i = 0; i < this.keywords.length; i++) {
            const keyword = this.keywords[i];
            const keywordValue = keyword.value;

            const savePromise = this.chiefComplaintKeywordService
                .createIcdCodeMap(keywordValue, this.codeKeywordsFormData.icdCode)
                .catch(error => this.alertService.error(error.message ? error.message : error));

            saveCodeKeywordPromises.push(savePromise);
        }

        Promise.all(saveCodeKeywordPromises)
            .then(() => {
                this.isCodeKeywordsPopupOpened = false;
            });
    }

    validateIcdCodeMappingExistence = (params) => {
        if (!this.isNewCodeKeywordsMapping)
            return true;

        const icdCodeId = params.value;
        this.chiefComplaintKeywordService
            .getByIcdCode(icdCodeId)
            .then(keywords => {
                const isValidationSucceeded = !keywords || !keywords.length;

                params.rule.isValid = isValidationSucceeded;
                params.validator.validate();
            });

        return false;
    }

    validateKeywordExistence = (params) => {
        const keywordValue = params.value.toUpperCase();
        const keywordVWithSameValue = this.keywords
            .filter(l => l.value === keywordValue)[0];
        if (!keywordVWithSameValue) {
            return true;
        }

        return !keywordVWithSameValue ? true : keywordVWithSameValue.id === params.data.Id;
    }

    onNewKeywordInserted($event) {
        if (!this.isNewCodeKeywordsMapping) {
            const keywordValue = $event.data.value;
            if (!keywordValue)
                return;

            if (!this.isNewCodeKeywordsMapping) {
                this.chiefComplaintKeywordService.createIcdCodeMap(keywordValue, this.codeKeywordsFormData.icdCode)
                    .catch(error => this.alertService.error(error.message ? error.message : error));
            }
        }
    }

    onKeywordRemoved($event) {
        if (!this.isNewCodeKeywordsMapping) {
            const keywordId = $event.data.id;
            if (!keywordId)
                return;

            this.chiefComplaintKeywordService.deleteIcdCodeMap(keywordId, this.codeKeywordsFormData.icdCode)
                .catch(error => this.alertService.error(error.message ? error.message : error));
        } else {
            const keywordValue = $event.data.Value;
            if (!keywordValue)
                return;

            const keywordInedxToRemove =
                this.keywords.map(k => k.value).indexOf(keywordValue);

            this.keywords.splice(keywordInedxToRemove, 1);
        }
    }

    ngAfterViewInit() {
        this.registerEscapeBtnEventHandler(this.codeKeywordsPopup);
    }

    openCodeKeywordsForm() {
        this.isCodeKeywordsPopupOpened = true;
    }

    onCodeKeywordsPopupClose() {
        this.resetKeywordIcdCodeCreationFormData();
        this.selectedCodes = [];
        this.codeKeywordsDataGrid.instance.refresh();
    }

    onCodeSelected($event) {
        const icdCodeKeywords = $event.selectedRowsData[0];
        if (!icdCodeKeywords) {
            return;
        }

        const icdCodeId = icdCodeKeywords.icdCodeId;
        if (!icdCodeId) {
            this.selectedCodes = [];
            return;
        }

        this.chiefComplaintKeywordService.getByIcdCode(icdCodeId)
            .then(keywords => {
                this.keywords = keywords;
                this.codeKeywordsFormData.icdCode = icdCodeKeywords.icdCodeId;

                this.isNewCodeKeywordsMapping = false;
                this.isCodeKeywordsPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error))
    }

    private resetKeywordIcdCodeCreationFormData(): void {
        this.isNewCodeKeywordsMapping = true;
        this.codeKeywordsFormData = {};
        this.keywords = [];
    }

    private init(): void {
        this.initKeywordIcdCodesDataSource();
        this.initIcdCodesDataSource();
    }

    private initIcdCodesDataSource() {
        this.icdCodesDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("icdcode"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private initKeywordIcdCodesDataSource(): void {
        this.icdCodeKeywordsDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("icdcode"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}