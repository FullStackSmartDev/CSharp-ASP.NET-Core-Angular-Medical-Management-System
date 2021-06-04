import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { BaseHistoryComponent } from '../patientHistory/baseHistoryComponent';
import { VitalSigns } from '../../dataModels/vitalSigns';
import { LoadPanelService } from '../../provider/loadPanelService';
import { AlertService } from '../../provider/alertService';
import { VitalSignsDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ToastService } from '../../provider/toastService';
import { TemplateLookupItemValidationDataService } from '../../provider/dataServices/read/templateLookupItemValidationDataService';
import CustomStore from 'devextreme/data/custom_store';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { PatientDataModelTrackService } from '../../provider/patientDataModelTrackService';
import { DefaultValuesProvider } from '../../provider/defaultValuesProvider';
import { LookupItemsAppService } from '../../provider/appServices/lookupItemsAppService';

@Component({
    templateUrl: 'vitalSignsComponent.html',
    selector: "vital-signs"
})

export class VitalSignsComponent extends BaseHistoryComponent implements OnInit {
    @Input("patientId") patientId: string;
    @Input("admissionId") admissionId: string;
    @Input("isSignedOff") isSignedOff: boolean;

    @ViewChild("vitalSignsDataGrid") vitalSignsDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateVitalSignsPopup") createUpdateVitalSignsPopup: DxPopupComponent;


    selectedVitalSigns: Array<any> = [];
    vitalSigns: VitalSigns;
    isNewVitalSigns: boolean = true;

    vitalSignsDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(loadPanelService: LoadPanelService,
        alertService: AlertService,
        private vitalSignsDataService: VitalSignsDataService,
        toastService: ToastService, lookupItemsAppService: LookupItemsAppService,
        private patientDataModelTrackService: PatientDataModelTrackService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);
    }

    get lookupItemNames(): string[] {
        return [
            "bloodPressurePosition",
            "bloodPressureLocation",
            "oxygenSatTest"
        ];
    }

    ngOnInit(): void {
        this.init();
    }

    openVitalSignsCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupShowing() {
        this.setVitalSignsDefaultValues();
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateTemplateTypeForm();
        this.selectedVitalSigns = [];
    }

    createUpdateVitalSigns($event) {
        $event.preventDefault();

        this.isCreateUpdatePopupOpened = false;
        this.loadPanelService
            .showLoader("Saving...");

        this.vitalSigns.convertToEntityModel();

        const createUpdateVitalSignsPromise = this.isNewVitalSigns
            ? this.vitalSignsDataService
                .create(this.vitalSigns)
            : this.vitalSignsDataService
                .update(this.vitalSigns);

        createUpdateVitalSignsPromise
            .then(() => {
                this.vitalSignsDataGrid
                    .instance.refresh();
                this.resetCreateUpdateTemplateTypeForm();

                this.patientDataModelTrackService
                    .emitPatientDataModelChanges(true);

                this.loadPanelService.hideLoader();
                this.selectedVitalSigns = [];
                this.toastService
                    .showSuccessMessage("Vital signs was updated successfuly");
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error");
            });
    }

    onSelectedVitalSigns($event) {
        if (this.isSignedOff) {
            this.selectedVitalSigns = [];
            return;
        }

        const selectedVitalSigns = $event.selectedRowsData[0];
        if (!selectedVitalSigns)
            return;
        const selectedVitalSignsId =
            selectedVitalSigns.Id;

        this.vitalSignsDataService
            .getById(selectedVitalSignsId)
            .then((vitalSigns) => {
                this.vitalSigns = vitalSigns;
                this.isCreateUpdatePopupOpened = true;
                this.isNewVitalSigns = false;
            })
            .catch(error => this.toastService
                .showErrorMessage(error.message ? error.message : error));
    }

    private setVitalSignsDefaultValues() {

        this.vitalSigns.BloodPressureLocation =
            this["bloodPressureLocation"].defaultValue;

        this.vitalSigns.BloodPressurePosition =
            this["bloodPressurePosition"].defaultValue;

        this.vitalSigns.OxygenSaturationAtRest =
            this["oxygenSatTest"].defaultValue;
    }

    private initNewVitalSigns() {
        this.vitalSigns =
            new VitalSigns("", false, this.patientId, this.admissionId);

    }

    private resetCreateUpdateTemplateTypeForm() {
        this.isNewVitalSigns = true;
        this.initNewVitalSigns();
    }

    private init(): any {
        this.initNewVitalSigns();
        this.initVitalSignsDataSource();
    }

    private initVitalSignsDataSource(): any {
        this.vitalSignsDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.vitalSignsDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                loadOptions.sort = [
                    {
                        selector: "CreateDate",
                        desc: true
                    }
                ]
                const byPatientIdFilter = ["PatientId", "=", this.patientId];
                const byAdmissionIdFilter = ["AdmissionId", "=", this.admissionId];
                const nonDeletedItemsFilter = ["IsDelete", "=", false];

                if (!loadOptions.filter) {
                    loadOptions.filter = [
                        byPatientIdFilter,
                        "and",
                        nonDeletedItemsFilter,
                        "and",
                        byAdmissionIdFilter
                    ];
                }
                else {
                    if (ArrayHelper.isArray(loadOptions.filter[0])) {
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(byPatientIdFilter);
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(nonDeletedItemsFilter);
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(byAdmissionIdFilter);
                    }
                    else {
                        loadOptions.filter = [
                            loadOptions.filter,
                            "and",
                            byPatientIdFilter,
                            "and",
                            nonDeletedItemsFilter,
                            "and",
                            byAdmissionIdFilter
                        ]
                    }
                }
                return this.vitalSignsDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}