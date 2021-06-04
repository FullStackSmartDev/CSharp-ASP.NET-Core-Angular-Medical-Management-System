import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../patientHistory/baseHistoryComponent';
import { LoadPanelService } from '../../provider/loadPanelService';
import { AlertService } from '../../provider/alertService';
import { BaseVitalSignsDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../provider/dataServices/read/templateLookupItemValidationDataService';
import CustomStore from 'devextreme/data/custom_store';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { BaseVitalSigns } from '../../dataModels/baseVitalSigns';
import { MedicalCalculationHelper } from '../../helpers/medicalCalculationHelper';
import { PatientDataModelTrackService } from '../../provider/patientDataModelTrackService';
import { DefaultValuesProvider } from '../../provider/defaultValuesProvider';
import { LookupItemsAppService } from '../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'baseVitalSignsComponent.html',
    selector: "base-vital-signs"
})

export class BaseVitalSignsComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("createUpdateBaseVitalSignsPopup") createUpdateBaseVitalSignsPopup: DxPopupComponent;

    _isOxygenUse: boolean = false;

    baseVitalSigns: BaseVitalSigns;
    baseVitalSignsCopy: BaseVitalSigns;

    isNewBaseVitalSigns: boolean = true;

    baseVitalSignsDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private baseVitalSignsDataService: BaseVitalSignsDataService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        private patientDataModelTrackService: PatientDataModelTrackService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService, toastService, defaultValuesProvider, lookupItemsAppService);
    }

    dominantHand: string[] = ["Right", "Left"];

    get lookupItemNames(): string[] {
        return ["oxygenUse"];
    }

    get bmi(): string {
        const patientWeight = this.baseVitalSigns.Weight;
        const patientHeight = this.baseVitalSigns.Height;

        return MedicalCalculationHelper
            .calculateBmi(patientHeight, patientWeight);
    }

    get isOxygenUse(): boolean {
        return this._isOxygenUse;
    }

    set isOxygenUse(value) {
        if (!value) {
            this.baseVitalSignsCopy.OxygenAmount = null;
            this.baseVitalSignsCopy.OxygenUse = "";
        }
        else if (!this.baseVitalSignsCopy.OxygenUse) {
            this.baseVitalSignsCopy.OxygenUse =
                this["oxygenUse"].defaultValue;
        }

        this._isOxygenUse = value;
    }

    onCreateUpdatePopupDisposing() {
        this.baseVitalSignsCopy = null;
    }

    onCreateUpdatePopupShowing() {
        if (this.isNewBaseVitalSigns) {
            this.baseVitalSigns.DominantHand =
                this.dominantHand[0];
        }
    }

    ngOnInit(): void {
        this.init();
    }

    openBaseVitalSignsCreationForm($event) {
        $event.preventDefault();
        this.baseVitalSignsCopy =
            this.baseVitalSigns.createFromEntityModel(this.baseVitalSigns);
        if (this.baseVitalSignsCopy.OxygenUse || this.baseVitalSignsCopy.OxygenAmount) {
            this.isOxygenUse = true;
        }
        this.isCreateUpdatePopupOpened = true;
    }

    createUpdateBaseVitalSigns($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        const createUpdateBaseVitalSignsPromise = this.isNewBaseVitalSigns
            ? this.baseVitalSignsDataService
                .create(this.baseVitalSignsCopy)
            : this.baseVitalSignsDataService
                .update(this.baseVitalSignsCopy);

        createUpdateBaseVitalSignsPromise
            .then((baseVitalSigns) => {
                this.baseVitalSigns = baseVitalSigns;

                this.patientDataModelTrackService
                    .emitPatientDataModelChanges(true);

                this.loadPanelService.hideLoader();

                this.toastService
                    .showSuccessMessage("Vital Signs was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    private initBaseVitalSigns() {
        this.baseVitalSigns =
            new BaseVitalSigns("", false, this.patientId);

        const self = this;
        const loadOptions = {
            filter: ["PatientId", "=", this.patientId]
        }
        this.baseVitalSignsDataService
            .firstOrDefault(loadOptions)
            .then((baseVitalsigns) => {
                if (baseVitalsigns) {
                    self.baseVitalSigns = baseVitalsigns;
                    self.isNewBaseVitalSigns = false;
                }
            });
    }

    private init(): any {
        this.initBaseVitalSigns();
        this.initBaseVitalSignsDataSource();
    }

    private initBaseVitalSignsDataSource(): any {
        const self = this;
        this.baseVitalSignsDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.baseVitalSignsDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const byPatientIdFilter = ["PatientId", "=", self.patientId];
                const nonDeletedItemsFilter = ["IsDelete", "=", false];

                if (!loadOptions.filter) {
                    loadOptions.filter = [
                        byPatientIdFilter,
                        "and",
                        nonDeletedItemsFilter
                    ];
                }
                else {
                    if (ArrayHelper.isArray(loadOptions.filter[0])) {
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(byPatientIdFilter);
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(nonDeletedItemsFilter);
                    }
                    else {
                        loadOptions.filter = [
                            loadOptions.filter,
                            "and",
                            byPatientIdFilter,
                            "and",
                            nonDeletedItemsFilter
                        ]
                    }
                }
                return self.baseVitalSignsDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => self.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}