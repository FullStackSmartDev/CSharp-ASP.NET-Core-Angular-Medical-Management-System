import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { BaseComponent } from '../baseComponent';
import { DataService } from '../../provider/dataService';
import { ToastService } from '../../provider/toastService';
import CustomStore from 'devextreme/data/custom_store';
import { IcdCodeKeywordsDataService } from '../../provider/dataServices/readCreateUpdate/IcdCodeKeywordsDataService';
import { KeywordDataService } from '../../provider/dataServices/readCreateUpdate/keywordDataService';
import { AlertService } from '../../provider/alertService';
import { Keyword } from '../../dataModels/keyword';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import { LoadPanelService } from '../../provider/loadPanelService';

@Component({
    templateUrl: 'keywordIcdCodeMapComponent.html',
    selector: 'keyword-icd-code-map'
})

export class KeywordIcdCodeMapComponent extends BaseComponent implements AfterViewInit {
    @ViewChild("codeKeywordsDataGrid") codeKeywordsDataGrid: DxDataGridComponent;
    @ViewChild("codeKeywordsPopup") codeKeywordsPopup: DxPopupComponent;
    @ViewChild("codeKeywordsForm") codeKeywordsForm: DxFormComponent;

    isNewCodeKeywordsMapping: boolean = true;
    keywordIcdCodes: any;

    codeKeywordsDataSource: any = {};
    icdCodesDataSource: any = {};

    codeKeywordsFormData: any = {};
    keywords: Keyword[] = [];

    selectedCodes: Array<any> = [];

    isCodeKeywordsPopupOpened: boolean = false;

    constructor(dataService: DataService,
        private keywordDataService: KeywordDataService,
        private loadPanelService: LoadPanelService,
        toastService: ToastService,
        private icdCodeKeywordsDataService: IcdCodeKeywordsDataService,
        private alertService: AlertService,
        private lookupDataSourceProvider: LookupDataSourceProvider) {

        super(dataService, toastService);

        this.init();

        this.validateKeywordExistence =
            this.validateKeywordExistence.bind(this);

        this.validateIcdCodeMappingExistence =
            this.validateIcdCodeMappingExistence.bind(this);
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

        this.loadPanelService.showLoader();
        const saveCodeKeywordPromises = [];

        for (let i = 0; i < this.keywords.length; i++) {
            const keyword = this.keywords[i];
            const keywordValue = keyword.Value;

            const savePromise = this.icdCodeKeywordsDataService.create(keywordValue, this.codeKeywordsFormData.icdCode)
                .catch(error => this.alertService.error(error.message ? error.message : error));

            saveCodeKeywordPromises.push(savePromise);
        }

        Promise.all(saveCodeKeywordPromises)
            .then(() => {
                this.isCodeKeywordsPopupOpened = false;
                this.loadPanelService.hideLoader();
            });
    }

    validateIcdCodeMappingExistence(params) {
        if (!this.isNewCodeKeywordsMapping)
            return true;
        const icdCodeId = params.value;
        this.keywordDataService
            .getByIcdCode(icdCodeId)
            .then(keywords => {
                const isValidationSucceeded = !keywords || !keywords.length;

                params.rule.isValid = isValidationSucceeded;
                params.validator.validate();
            });

        return false;
    }

    validateKeywordExistence(params) {
        const keywordValue = params.value.toUpperCase();
        const keywordVWithSameValue = this.keywords
            .filter(l => l.Value === keywordValue)[0];
        if (!keywordVWithSameValue) {
            return true;
        }

        return !keywordVWithSameValue ? true : keywordVWithSameValue.Id === params.data.Id;
    }

    onNewKeywordInserted($event) {
        if (!this.isNewCodeKeywordsMapping) {
            const keywordValue = $event.data.Value;
            if (!keywordValue)
                return;

            if (!this.isNewCodeKeywordsMapping) {
                this.icdCodeKeywordsDataService.create(keywordValue, this.codeKeywordsFormData.icdCode)
                    .catch(error => this.alertService.error(error.message ? error.message : error));
            }
        }
    }

    onKeywordRemoved($event) {
        if (!this.isNewCodeKeywordsMapping) {
            const keywordId = $event.data.Id;
            if (!keywordId)
                return;

            this.icdCodeKeywordsDataService.delete(keywordId, this.codeKeywordsFormData.icdCode)
                .catch(error => this.alertService.error(error.message ? error.message : error));
        } else {
            const keywordValue = $event.data.Value;
            if (!keywordValue)
                return;

            const keywordInedxToRemove =
                this.keywords.map(k => k.Value).indexOf(keywordValue);

            this.keywords.splice(keywordInedxToRemove, 1);
        }
    }

    ngAfterViewInit() {
        this.codeKeywordsPopup.instance
            .registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            })
    }

    openCodeKeywordsCreationForm() {
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

        const icdCodeId = icdCodeKeywords.IcdCodeId;
        if (!icdCodeId) {
            this.selectedCodes = [];
            return;
        }

        this.keywordDataService.getByIcdCode(icdCodeId)
            .then(keywords => {
                this.keywords = keywords
                this.codeKeywordsFormData.icdCode = icdCodeKeywords.IcdCodeId;

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
        this.icdCodesDataSource = this.lookupDataSourceProvider
            .icdCodeLookupDataSource;
    }

    private initKeywordIcdCodesDataSource(): void {
        this.codeKeywordsDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key) {
                    return Promise.resolve();
                }
                return this.icdCodeKeywordsDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const skipCount = loadOptions.skip || 0;
                const takeCount = loadOptions.take || 0;

                return this.icdCodeKeywordsDataService.search(skipCount, takeCount)
                    .then(result => {
                        return {
                            data: result.Data,
                            totalCount: result.TotalCount,
                        }
                    });
            }
        });
    }
}