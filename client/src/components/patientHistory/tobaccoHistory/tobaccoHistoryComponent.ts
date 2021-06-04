
import { ViewChild, Component, Input, OnInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidationGroupComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { TobaccoHistory } from '../../../dataModels/TobaccoHistory';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { TobaccoHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'tobaccoHistoryComponent.html',
    selector: 'tobacco-history'
})
export class TobaccoHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("tobaccoHistoryDataGrid") tobaccoHistoryDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateTobaccoHistoryPopup") createUpdateTobaccoHistoryPopup: DxPopupComponent;

    @ViewChild("tobaccoHistoryValidationGroup") tobaccoHistoryValidationGroup: DxValidationGroupComponent;

    selectedTobaccoHistory: Array<any> = [];
    tobaccoHistory: TobaccoHistory;
    isNewTobaccoHistory: boolean = true;
    tobaccoHistoryDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService, private tobaccoHistoryDataService: TobaccoHistoryDataService,
        toastService: ToastService, lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [
            "statusTobaccoUse",
            "typeTobacco",
            "useTobacco",
            "duration",
            "useFrequency"
        ];
    }

    get isNeverSmoked(): boolean {
        const tobaccoStatus =
            this.tobaccoHistory.Status;
        if (!tobaccoStatus) {
            return false;
        }

        return tobaccoStatus
            .indexOf("Never") !== -1;
    }

    get quit(): boolean {
        return this.tobaccoHistory.Quit;
    }

    set quit(quitValue: boolean) {
        this.tobaccoHistory.Quit = quitValue;
        if (!quitValue) {
            this.tobaccoHistory.StatusLength = null;
            this.tobaccoHistory.StatusLengthType = null;
        }
    }

    ngOnInit(): void {
        this.init();
    }

    openTobaccoHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateTemplateTypeForm();
        this.selectedTobaccoHistory = [];
    }

    createUpdateTobaccoHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.tobaccoHistory.convertToEntityModel();

        const createUpdateTobaccoHistoryPromise = this.isNewTobaccoHistory
            ? this.tobaccoHistoryDataService
                .create(this.tobaccoHistory)
            : this.tobaccoHistoryDataService
                .update(this.tobaccoHistory);

        createUpdateTobaccoHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.tobaccoHistoryDataService, PatientHistoryNames.tobaccoHistory);

                if (this.tobaccoHistoryDataGrid && this.tobaccoHistoryDataGrid.instance) {
                    this.tobaccoHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateTemplateTypeForm();
                this.loadPanelService.hideLoader();
                this.selectedTobaccoHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedTobaccoHistory($event) {
        if (this.isSignedOff) {
            this.selectedTobaccoHistory = [];
            return;
        }
        const self = this;
        const selectedTobaccoHistory = $event.selectedRowsData[0];
        if (!selectedTobaccoHistory)
            return;
        const selectedTobaccoHistoryId =
            selectedTobaccoHistory.Id;

        this.tobaccoHistoryDataService
            .getById(selectedTobaccoHistoryId)
            .then((tobaccoHistory) => {
                self.tobaccoHistory = tobaccoHistory;
                self.isCreateUpdatePopupOpened = true;
                self.isNewTobaccoHistory = false;
            })
            .catch(error => self.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateTemplateTypeForm() {
        this.resetValidation();
        this.isNewTobaccoHistory = true;
        this.setLatestTobaccoHistoryIfExists();
    }

    private resetValidation() {
        this.tobaccoHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.setLatestTobaccoHistoryIfExists();
        this.initTobaccoHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.tobaccoHistoryDataService, PatientHistoryNames.tobaccoHistory);
    }

    private setLatestTobaccoHistoryIfExists() {
        const byPatientIdFilter = ["PatientId", "=", this.patientId];
        const nonDeletedItemsFilter = ["IsDelete", "=", false];

        const loadOptions = {
            filter: [byPatientIdFilter, "and", nonDeletedItemsFilter],
            sort: [
                {
                    selector: "CreateDate",
                    desc: true
                }
            ]
        }
        const self = this;
        this.tobaccoHistoryDataService
            .firstOrDefault(loadOptions)
            .then(tobaccoHistory => {
                const lastCreatedTobaccoHistory = new TobaccoHistory("", false, self.patientId);

                if (tobaccoHistory) {
                    lastCreatedTobaccoHistory.StatusLengthType = tobaccoHistory.StatusLengthType;
                    lastCreatedTobaccoHistory.Status = tobaccoHistory.Status;
                    lastCreatedTobaccoHistory.Type = tobaccoHistory.Type;
                    lastCreatedTobaccoHistory.Amount = tobaccoHistory.Amount;
                    lastCreatedTobaccoHistory.Use = tobaccoHistory.Use;
                    lastCreatedTobaccoHistory.Frequency = tobaccoHistory.Frequency;
                    lastCreatedTobaccoHistory.Length = tobaccoHistory.Length;
                    lastCreatedTobaccoHistory.Duration = tobaccoHistory.Duration;
                    lastCreatedTobaccoHistory.Quit = !!tobaccoHistory.Quit;
                    lastCreatedTobaccoHistory.StatusLength = tobaccoHistory.StatusLength;
                    lastCreatedTobaccoHistory.Notes = tobaccoHistory.Notes;
                }

                self.tobaccoHistory = lastCreatedTobaccoHistory;
            });
    }

    private initTobaccoHistoryDataSource(): any {
        this.tobaccoHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.tobaccoHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return this.tobaccoHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}