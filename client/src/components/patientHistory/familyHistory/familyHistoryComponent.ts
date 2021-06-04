import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { ToastService } from '../../../provider/toastService';
import { FamilyHistory } from '../../../dataModels/familyHistory';
import CustomStore from 'devextreme/data/custom_store';
import { FamilyHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';
import { LookupDataSourceProvider } from '../../../provider/lookupDataSourceProvider';
import { IcdCodeReadDataService } from '../../../provider/dataServices/read/IcdCodeReadDataService';

@Component({
    templateUrl: 'familyHistoryComponent.html',
    selector: 'family-history'
})

export class FamilyHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("familyHistoryDataGrid") familyHistoryDataGrid: DxDataGridComponent;
    @ViewChild("familyHistoryValidationGroup") familyHistoryValidationGroup: DxValidationGroupComponent;

    @ViewChild("icdCodeLookup") icdCodeLookup: DxLookupComponent;

    icdCodeDataSource: any = {};
    familyHistoryDataSource: any = {};
    familyHistory: FamilyHistory;

    ngOnInit() {
        this.init();
    }

    isNewFamilyHistory: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedFamilyHistory: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private familyHistoryDataService: FamilyHistoryDataService,
        private icdCodeReadDataService: IcdCodeReadDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider,
        private lookupDataSourceProvider: LookupDataSourceProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return ["family", "familyStatus"];
    }

    openFamilyHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateFamilyHistoryForm();
        this.selectedFamilyHistory = [];
    }

    diagnosisChanged($event) {
        const icdCodeId = $event.value;
        if (!icdCodeId) {
            return;
        }

        this.icdCodeReadDataService
            .getById(icdCodeId)
            .then(icdCode => {
                this.familyHistory.Diagnosis = icdCode.Name;
                this.icdCodeLookup.instance.reset();
            });
    }

    createUpdateFamilyHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.familyHistory.convertToEntityModel();

        const createUpdatefamilyHistoryPromise = this.isNewFamilyHistory
            ? this.familyHistoryDataService
                .create(this.familyHistory)
            : this.familyHistoryDataService
                .update(this.familyHistory);

        createUpdatefamilyHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.familyHistoryDataService, PatientHistoryNames.familyHistory);

                if (this.familyHistoryDataGrid && this.familyHistoryDataGrid.instance) {
                    this.familyHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateFamilyHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedFamilyHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedFamilyHistory($event) {
        if (this.isSignedOff) {
            this.selectedFamilyHistory = [];
            return;
        }

        const selectedFamilyHistory = $event.selectedRowsData[0];
        if (!selectedFamilyHistory)
            return;

        const selectedFamilyHistoryId =
            selectedFamilyHistory.Id;

        this.familyHistoryDataService
            .getById(selectedFamilyHistoryId)
            .then((familyHistory) => {
                this.familyHistory = familyHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewFamilyHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateFamilyHistoryForm() {
        this.resetValidation();
        this.isNewFamilyHistory = true;
        this.familyHistory =
            new FamilyHistory("", false, this.patientId);
    }

    private resetValidation() {
        this.familyHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initIcdCodeDataSource();
        this.initFamilyHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.familyHistoryDataService, PatientHistoryNames.familyHistory);

        this.familyHistory = new FamilyHistory("", false, this.patientId);
    }

    private initIcdCodeDataSource() {
        this.icdCodeDataSource.store = this.lookupDataSourceProvider.icdCodeLookupDataSource;
    }

    private initFamilyHistoryDataSource(): any {
        this.familyHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.familyHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return this.familyHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}