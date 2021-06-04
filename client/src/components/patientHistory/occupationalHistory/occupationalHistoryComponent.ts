import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { OccupationalHistory } from '../../../dataModels/occupationalHistory';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AlertService } from '../../../provider/alertService';
import { TemplateLookupItemValidationDataService } from '../../../provider/dataServices/read/templateLookupItemValidationDataService';
import { ToastService } from '../../../provider/toastService';
import { OccupationalHistoryDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { BaseHistoryComponent } from '../baseHistoryComponent';
import CustomStore from 'devextreme/data/custom_store';
import { DateHelper } from '../../../helpers/dateHelpers';
import { DefaultValuesProvider } from '../../../provider/defaultValuesProvider';
import { PatientHistoryNames } from '../../../constants/patientHistoryNames';
import { LookupItemsAppService } from '../../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'occupationalHistoryComponent.html',
    selector: 'occupational-history'
})

export class OccupationalHistoryComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string = "";
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("occupationalHistoryDataGrid") occupationalHistoryDataGrid: DxDataGridComponent;
    @ViewChild("occupationalHistoryValidationGroup") occupationalHistoryValidationGroup: DxValidationGroupComponent;

    _hasDisabilityClaim: boolean;
    _hasWorkersCompensationClaim: boolean;

    get hasWorkersCompensationClaim(): boolean {
        return this._hasWorkersCompensationClaim;
    }

    set hasWorkersCompensationClaim(value: boolean) {
        this._hasWorkersCompensationClaim = value;
        if (!value && this.occupationalHistory) {
            this.occupationalHistory.WorkersCompensationClaimDetails = "";
        }
    }

    get hasDisabilityClaim(): boolean {
        return this._hasDisabilityClaim;
    }

    set hasDisabilityClaim(value: boolean) {
        this._hasDisabilityClaim = value;
        if (!value && this.occupationalHistory) {
            this.occupationalHistory.DisabilityClaimDetails = "";
        }
    }

    occupationalHistoryDataSource: any = {};
    occupationalHistory: OccupationalHistory;

    ngOnInit() {
        this.init();
    }

    isNewOccupationalHistory: boolean = true;

    isCreateUpdatePopupOpened: boolean = false;
    selectedOccupationalHistory: any[];

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private occupationalHistoryDataService: OccupationalHistoryDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return ["occupation", "employment_Status"];
    }

    openOccupationalHistoryCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateOccupationalHistoryForm();
        this.selectedOccupationalHistory = [];
    }

    createUpdateOccupationalHistory($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.occupationalHistory.convertToEntityModel();

        const createUpdateoccupationalHistoryPromise = this.isNewOccupationalHistory
            ? this.occupationalHistoryDataService
                .create(this.occupationalHistory)
            : this.occupationalHistoryDataService
                .update(this.occupationalHistory);

        createUpdateoccupationalHistoryPromise
            .then(() => {
                this.setHistoryExistanceAndDefaultValue(this.patientId,
                    this.occupationalHistoryDataService, PatientHistoryNames.occupationalHistory);

                if (this.occupationalHistoryDataGrid && this.occupationalHistoryDataGrid.instance) {
                    this.occupationalHistoryDataGrid
                        .instance.refresh();
                }

                this.resetCreateUpdateOccupationalHistoryForm();
                this.loadPanelService.hideLoader();
                this.selectedOccupationalHistory = [];
                this.toastService
                    .showSuccessMessage("History was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    getOccupationalDays(gridItem) {
        const startDate = new Date(gridItem.Start);
        const endDate = gridItem.End ? new Date(gridItem.End) : new Date();
        return DateHelper.getDaysBetween(startDate, endDate);
    }

    onSelectedOccupationalHistory($event) {
        if (this.isSignedOff) {
            this.selectedOccupationalHistory = [];
            return;
        }

        const selectedOccupationalHistory = $event.selectedRowsData[0];
        if (!selectedOccupationalHistory)
            return;

        const selectedOccupationalHistoryId =
            selectedOccupationalHistory.Id;

        this.occupationalHistoryDataService
            .getById(selectedOccupationalHistoryId)
            .then((occupationalHistory) => {
                this.occupationalHistory = occupationalHistory;

                this.hasDisabilityClaim = !!occupationalHistory.DisabilityClaimDetails;
                this.hasWorkersCompensationClaim = !!occupationalHistory.WorkersCompensationClaimDetails;

                this.isCreateUpdatePopupOpened = true;
                this.isNewOccupationalHistory = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private resetCreateUpdateOccupationalHistoryForm() {
        this.resetValidation();
        this.isNewOccupationalHistory = true;
        this.occupationalHistory =
            new OccupationalHistory("", false, this.patientId);

        this.hasDisabilityClaim = false;
        this.hasWorkersCompensationClaim = false;
    }

    private resetValidation() {
        this.occupationalHistoryValidationGroup
            .instance
            .reset();
    }

    private init(): any {
        this.initOccupationalHistoryDataSource();
        this.setHistoryExistanceAndDefaultValue(this.patientId,
            this.occupationalHistoryDataService, PatientHistoryNames.occupationalHistory);

        this.occupationalHistory =
            new OccupationalHistory("", false, this.patientId);

        this.hasDisabilityClaim = false;
        this.hasWorkersCompensationClaim = false;
    }


    private initOccupationalHistoryDataSource(): any {
        const self = this;
        this.occupationalHistoryDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.occupationalHistoryDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                this.customizeHistoryLoadOptions(loadOptions, this.patientId);

                return self.occupationalHistoryDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}