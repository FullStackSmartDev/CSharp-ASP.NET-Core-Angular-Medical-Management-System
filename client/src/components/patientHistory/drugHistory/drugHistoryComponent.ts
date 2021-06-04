import { ViewChild, Component, Input, OnInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidationGroupComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { DrugHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import { DrugHistory } from '../../../dataModels/drugHistory';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'drugHistoryComponent.html',
    selector: 'drug-history'
})
export class DrugHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("drugHistoryDataGrid") drugHistoryDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateDrugHistoryPopup") createUpdateDrugHistoryPopup: DxPopupComponent;
    @ViewChild("drugHistoryValidationGroup") drugHistoryValidationGroup: DxValidationGroupComponent;

    selectedDrugHistory: Array<any> = [];
    drugHistory: DrugHistory;
    isNewDrugHistory: boolean = true;

    drugHistoryDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private drugHistoryDataService: DrugHistoryDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [
            "statusDrugUse",
            "typeDrugs",
            "useDrug",
            "useDrugRoute",
            "useFrequency",
            "duration"
        ];
    }

    get isNeverUseDrug(): boolean {
        const drugStatus =
            this.drugHistory.Status;
        if (!drugStatus) {
            return false;
        }

        return drugStatus
            .indexOf("Never") !== -1;
    }

    ngOnInit(): void {
        this.init();
    }

    openDrugHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateDrugHistoryForm();
        this.selectedDrugHistory = [];
    }

    createUpdateDrugHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.drugHistory.convertToEntityModel();

        const createUpdateDrugHistoryPromise = this.isNewDrugHistory
            ? this.drugHistoryDataService
                .create(this.drugHistory)
            : this.drugHistoryDataService
                .update(this.drugHistory);

        createUpdateDrugHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.drugHistoryDataService, PatientHistoryNames.drugHistory);

                if (this.drugHistoryDataGrid && this.drugHistoryDataGrid.instance) {
                    this.drugHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateDrugHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedDrugHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedDrugHistory($event) {
        if (this.isSignedOff) {
            this.selectedDrugHistory = [];
            return;
        }

        const selectedDrugHistory = $event.selectedRowsData[0];
        if (!selectedDrugHistory)
            return;
        const selectedDrugHistoryId =
            selectedDrugHistory.Id;

        this.drugHistoryDataService
            .getById(selectedDrugHistoryId)
            .then((drugHistory) => {
                this.drugHistory = drugHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewDrugHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    get quit(): boolean {
        return this.drugHistory.Quit;
    }

    set quit(quitValue: boolean) {
        this.drugHistory.Quit = quitValue;
        if (!quitValue) {
            this.drugHistory.StatusLength = null;
            this.drugHistory.StatusLengthType = null;
        }
    }

    private resetCreateUpdateDrugHistoryForm() {
        this.resetValidation();
        this.isNewDrugHistory = true;
        this.setLatestDruglHistoryIfExists();
    }

    private resetValidation() {
        this.drugHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.setLatestDruglHistoryIfExists();
        this.initDrugHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.drugHistoryDataService, PatientHistoryNames.drugHistory);
    }

    private setLatestDruglHistoryIfExists() {
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

        this.drugHistoryDataService
            .firstOrDefault(loadOptions)
            .then(drugHistory => {
                const lastCreatedDrugHistory = new DrugHistory("", false, self.patientId);

                if (drugHistory) {
                    lastCreatedDrugHistory.StatusLengthType = drugHistory.StatusLengthType;
                    lastCreatedDrugHistory.Status = drugHistory.Status;
                    lastCreatedDrugHistory.Type = drugHistory.Type;
                    lastCreatedDrugHistory.Amount = drugHistory.Amount;
                    lastCreatedDrugHistory.Use = drugHistory.Use;
                    lastCreatedDrugHistory.Frequency = drugHistory.Frequency;
                    lastCreatedDrugHistory.Length = drugHistory.Length;
                    lastCreatedDrugHistory.Duration = drugHistory.Duration;
                    lastCreatedDrugHistory.Quit = !!drugHistory.Quit;
                    lastCreatedDrugHistory.StatusLength = drugHistory.StatusLength;
                    lastCreatedDrugHistory.Notes = drugHistory.Notes;
                    lastCreatedDrugHistory.Route = drugHistory.Route;
                }

                self.drugHistory = lastCreatedDrugHistory;
            });
    }

    private initDrugHistoryDataSource(): any {
        const self = this;
        this.drugHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.drugHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return self.drugHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}