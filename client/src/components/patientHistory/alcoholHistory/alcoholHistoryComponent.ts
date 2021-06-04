import { ViewChild, Component, Input, OnInit } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidationGroupComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { AlcoholHistory } from '../../../dataModels/alcoholHistory';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { AlcoholHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'alcoholHistoryComponent.html',
    selector: 'alcohol-history'
})
export class AlcoholHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("alcoholHistoryDataGrid") alcoholHistoryDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateAlcoholHistoryPopup") createUpdateAlcoholHistoryPopup: DxPopupComponent;

    @ViewChild("alcoholHistoryValidationGroup") alcoholHistoryValidationGroup: DxValidationGroupComponent;

    selectedAlcoholHistory: Array<any> = [];
    alcoholHistory: AlcoholHistory;
    isNewalcoholHistory: boolean = true;

    alcoholHistoryDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private alcoholHistoryDataService: AlcoholHistoryDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [
            "statusEtohUse",
            "typeEtoh",
            "useAlcohol",
            "useFrequency",
            "duration"
        ]
    }

    get quit(): boolean {
        return this.alcoholHistory.Quit;
    }

    set quit(quitValue: boolean) {
        this.alcoholHistory.Quit = quitValue;
        if (!quitValue) {
            this.alcoholHistory.StatusLength = null;
            this.alcoholHistory.StatusLengthType = null;
        }
    }

    get isNeverDrank(): boolean {
        const alcoholStatus =
            this.alcoholHistory.Status;
        if (!alcoholStatus) {
            return false;
        }

        return alcoholStatus
            .indexOf("Never") !== -1;
    }

    ngOnInit(): void {
        this.init();
    }

    openAlcoholHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateAlcoholHistoryForm();
        this.selectedAlcoholHistory = [];
    }

    createUpdateAlcoholHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.alcoholHistory.convertToEntityModel();

        const createUpdatealcoholHistoryPromise = this.isNewalcoholHistory
            ? this.alcoholHistoryDataService
                .create(this.alcoholHistory)
            : this.alcoholHistoryDataService
                .update(this.alcoholHistory);

        createUpdatealcoholHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.alcoholHistoryDataService, PatientHistoryNames.alcoholHistory);

                if (this.alcoholHistoryDataGrid && this.alcoholHistoryDataGrid.instance) {
                    this.alcoholHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateAlcoholHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedAlcoholHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedAlcoholHistory($event) {
        if (this.isSignedOff) {
            this.selectedAlcoholHistory = [];
            return;
        }
        const selectedAlcoholHistory = $event.selectedRowsData[0];
        if (!selectedAlcoholHistory)
            return;
        const selectedalcoholHistoryId =
            selectedAlcoholHistory.Id;

        this.alcoholHistoryDataService
            .getById(selectedalcoholHistoryId)
            .then((alcoholHistory) => {
                this.alcoholHistory = alcoholHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewalcoholHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateAlcoholHistoryForm() {
        this.resetValidation();
        this.isNewalcoholHistory = true;
        this.setLatestAlcoholHistoryIfExists();
    }

    private resetValidation() {
        this.alcoholHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.setLatestAlcoholHistoryIfExists();
        this.initAlcoholHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.alcoholHistoryDataService, PatientHistoryNames.alcoholHistory);
    }

    private setLatestAlcoholHistoryIfExists() {
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
        this.alcoholHistoryDataService
            .firstOrDefault(loadOptions)
            .then(alcoholHistory => {
                const lastCreatedAlcoholHistory = new AlcoholHistory("", false, self.patientId);

                if (alcoholHistory) {
                    lastCreatedAlcoholHistory.StatusLengthType = alcoholHistory.StatusLengthType;
                    lastCreatedAlcoholHistory.Status = alcoholHistory.Status;
                    lastCreatedAlcoholHistory.Type = alcoholHistory.Type;
                    lastCreatedAlcoholHistory.Amount = alcoholHistory.Amount;
                    lastCreatedAlcoholHistory.Use = alcoholHistory.Use;
                    lastCreatedAlcoholHistory.Frequency = alcoholHistory.Frequency;
                    lastCreatedAlcoholHistory.Length = alcoholHistory.Length;
                    lastCreatedAlcoholHistory.Duration = alcoholHistory.Duration;
                    lastCreatedAlcoholHistory.Quit = !!alcoholHistory.Quit;
                    lastCreatedAlcoholHistory.StatusLength = alcoholHistory.StatusLength;
                    lastCreatedAlcoholHistory.Notes = alcoholHistory.Notes;
                }

                self.alcoholHistory = lastCreatedAlcoholHistory;
            });
    }

    private initAlcoholHistoryDataSource(): any {
        const self = this;
        this.alcoholHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.alcoholHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return self.alcoholHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}