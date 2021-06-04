import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { SurgicalHistory } from '../../../dataModels/surgicalHistory';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { ToastService } from '../../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import CustomStore from 'devextreme/data/custom_store';
import { SurgicalHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { CptCodeReadDataService } from '../../../provider/dataServices/read/readDataServices';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupDataSourceProvider } from '../../../provider/lookupDataSourceProvider';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'previousSurgicalHistoryComponent.html',
    selector: 'previous-surgical-history'
})

export class PreviousSurgicalHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("surgicalHistoryDataGrid") surgicalHistoryDataGrid: DxDataGridComponent;
    @ViewChild("surgicalHistoryValidationGroup") surgicalHistoryValidationGroup: DxValidationGroupComponent;

    @ViewChild("cptCodeLookup") cptCodeLookup: DxLookupComponent;

    cptCodeDataSource: any = {};
    surgicalHistoryDataSource: any = {};
    surgicalHistory: SurgicalHistory;

    isNewSurgicalHistory: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedSurgicalHistory: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private surgicalHistoryDataService: SurgicalHistoryDataService,
        private cptCodeReadDataService: CptCodeReadDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider,
        private lookupDataSourceProvider: LookupDataSourceProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [];
    }

    ngOnInit(): void {
        this.init();
    }

    openSurgicalHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateSurgicalHistoryForm();
        this.selectedSurgicalHistory = [];
    }

    createUpdateSurgicalHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.surgicalHistory.convertToEntityModel();

        const createUpdatesurgicalHistoryPromise = this.isNewSurgicalHistory
            ? this.surgicalHistoryDataService
                .create(this.surgicalHistory)
            : this.surgicalHistoryDataService
                .update(this.surgicalHistory);

        createUpdatesurgicalHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.surgicalHistoryDataService, PatientHistoryNames.surgicalHistory);

                if (this.surgicalHistoryDataGrid && this.surgicalHistoryDataGrid.instance) {
                    this.surgicalHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateSurgicalHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedSurgicalHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error")
            });
    }

    cptCodeChanged($event) {
        const cptCodeId = $event.value;
        if (!cptCodeId) {
            return;
        }

        const loadOptions = {
            filter: ["Id", "=", cptCodeId]
        }
        this.cptCodeReadDataService
            .firstOrDefault(loadOptions)
            .then(cptCode => {
                this.surgicalHistory.Diagnosis = cptCode.Name;
                this.cptCodeLookup.instance.reset();
            });
    }

    onSelectedSurgicalHistory($event) {
        if (this.isSignedOff) {
            this.selectedSurgicalHistory = [];
            return;
        }

        const selectedSurgicalHistory = $event.selectedRowsData[0];
        if (!selectedSurgicalHistory)
            return;

        const selectedSurgicalHistoryId =
            selectedSurgicalHistory.Id;

        this.surgicalHistoryDataService
            .getById(selectedSurgicalHistoryId)
            .then((surgicalHistory) => {
                this.surgicalHistory = surgicalHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewSurgicalHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateSurgicalHistoryForm() {
        this.resetValidation();
        this.isNewSurgicalHistory = true;
        this.surgicalHistory =
            new SurgicalHistory("", false, this.patientId);
    }

    private resetValidation() {
        this.surgicalHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initCptCodeDataSource();
        this.initSurgicalHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.surgicalHistoryDataService, PatientHistoryNames.surgicalHistory);

        this.surgicalHistory = new SurgicalHistory("", false, this.patientId);
    }

    private initCptCodeDataSource() {
        this.cptCodeDataSource.store =
            this.lookupDataSourceProvider.cptCodeLookupDataSource;
    }

    private initSurgicalHistoryDataSource(): any {
        this.surgicalHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.surgicalHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return this.surgicalHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}