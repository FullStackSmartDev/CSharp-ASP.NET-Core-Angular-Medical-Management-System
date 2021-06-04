import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { ToastService } from '../../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import { EducationHistory } from '../../../dataModels/educationHistory';
import CustomStore from 'devextreme/data/custom_store';
import { EducationHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'educationHistoryComponent.html',
    selector: 'education-history'
})

export class EducationHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("educationHistoryDataGrid") educationHistoryDataGrid: DxDataGridComponent;
    @ViewChild("educationHistoryValidationGroup") educationHistoryValidationGroup: DxValidationGroupComponent;

    educationHistoryDataSource: any = {};
    educationHistory: EducationHistory;

    minCompletedYearNumber: number = 1950;
    maxCompletedYearNumber: number = new Date().getFullYear();

    ngOnInit() {
        this.init();
    }

    isNewEducationHistory: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedEducationHistory: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private educationHistoryDataService: EducationHistoryDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return ["education"];
    }

    openEducationHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateEducationHistoryForm();
        this.selectedEducationHistory = [];
    }

    createUpdateEducationHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.educationHistory.convertToEntityModel();

        const createUpdateeducationHistoryPromise = this.isNewEducationHistory
            ? this.educationHistoryDataService
                .create(this.educationHistory)
            : this.educationHistoryDataService
                .update(this.educationHistory);

        createUpdateeducationHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.educationHistoryDataService, PatientHistoryNames.educationHistory);

                if (this.educationHistoryDataGrid && this.educationHistoryDataGrid.instance) {
                    this.educationHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateEducationHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedEducationHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error")
            });
    }

    onSelectedEducationHistory($event) {
        if (this.isSignedOff) {
            this.selectedEducationHistory = [];
            return;
        }

        const selectedEducationHistory = $event.selectedRowsData[0];
        if (!selectedEducationHistory)
            return;

        const selectedEducationHistoryId =
            selectedEducationHistory.Id;

        this.educationHistoryDataService
            .getById(selectedEducationHistoryId)
            .then((educationHistory) => {
                this.educationHistory = educationHistory;
                this.isCreateUpdatePopupOpened = true;
                this.isNewEducationHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateEducationHistoryForm() {
        this.resetValidation();
        this.isNewEducationHistory = true;
        this.educationHistory =
            new EducationHistory("", false, this.patientId);
    }

    private resetValidation() {
        this.educationHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initEducationHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.educationHistoryDataService, PatientHistoryNames.educationHistory);

        this.educationHistory = new EducationHistory("", false, this.patientId);
    }


    private initEducationHistoryDataSource(): any {
        const self = this;
        this.educationHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.educationHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return self.educationHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}