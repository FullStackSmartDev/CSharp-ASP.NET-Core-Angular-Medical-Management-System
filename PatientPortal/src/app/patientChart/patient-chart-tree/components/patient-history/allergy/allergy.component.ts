import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { Allergy } from "src/app/patientChart/models/allergy";
import { AlertService } from "src/app/_services/alert.service";
import { AllergyService } from "src/app/patientChart/patient-chart-tree/services/allergy.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { PatientChartTrackService } from "src/app/_services/patient-chart-track.service";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { MedicationClassService } from "../../../services/medication-class.service";
import { MedicationService } from "src/app/_services/medication.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from 'src/app/_classes/predefinedSelectableListsNames';

@Component({
    templateUrl: "allergy.component.html",
    selector: "allergy"
})
export class AllergyComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("allergyDataGrid", { static: false }) allergyDataGrid: DxDataGridComponent;
    @ViewChild("allergyPopup", { static: false }) allergyPopup: DxPopupComponent;
    @ViewChild("allergyForm", { static: false }) allergyForm: DxFormComponent;

    canRenderComponent: boolean = false;

    medicationClassId: string = null;
    medicationNameId: string = null;

    isAllergyPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedAllergy: Array<any> = [];
    allergy: any = new Allergy();

    isNewAllergy: boolean = true;

    allergyDataSource: any = {};
    medicationNameDataSource: any = {};
    medicationClassDataSource: any = {};

    constructor(private alertService: AlertService,
        private allergyService: AllergyService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        private medicationClassService: MedicationClassService,
        private medicationService: MedicationService,
        private patientChartTrackService: PatientChartTrackService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.allergy.notes = $event;
    }

    get medicationNameOrClassSelected(): boolean {
        var isMedicationNameOrClassExist = this.medicationClassId || this.medicationNameId;
        return !!isMedicationNameOrClassExist;
    }

    get medicationReactionListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.medAllergy)
    }

    onAllergyFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        if (dataField === "medicationName" && fieldValue) {
            this.allergy.medication = fieldValue.name;
        }
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.allergyPopup);
    }

    deleteHistory(allergy: Allergy, $event) {
        $event.stopPropagation();
        const allergyId = allergy.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.allergyService.delete(allergyId)
                    .then(() => {
                        this.patientChartTrackService.emitPatientChartChanges(true);
                        this.allergyDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });
            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setHistoryExistence();
    }

    openAllergyForm() {
        this.isAllergyPopupOpened = true;
    }

    onAllergyPopupHidden() {
        this.isNewAllergy = true;;
        this.selectedAllergy = [];
        this.allergy = new Allergy();

        this.medicationNameId = null;
        this.medicationClassId = null;
    }

    createUpdateAllergy() {
        const validationResult = this.allergyForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewAllergy)
            this.allergy.patientId = this.patientId;

        this.allergyService.save(this.allergy)
            .then(() => {
                this.patientChartTrackService.emitPatientChartChanges(true);

                if (this.allergyDataGrid && this.allergyDataGrid.instance) {
                    this.allergyDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isAllergyPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onAllergySelect($event) {
        if (this.isSignedOff) {
            this.selectedAllergy = [];
            return;
        }

        const selectedAllergy = $event.selectedRowsData[0];
        if (!selectedAllergy)
            return;

        const selectedAllergyId = selectedAllergy.id;

        this.allergyService.getById(selectedAllergyId)
            .then((allergy) => {
                this.allergy = allergy;

                if (allergy.medicationClassId)
                    this.medicationClassId = allergy.medicationClassId;

                if (allergy.medicationNameId)
                    this.medicationNameId = allergy.medicationNameId;

                this.isAllergyPopupOpened = true;
                this.isNewAllergy = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onMedicationClassChanged($event) {
        const medicationClassId = $event.value;
        this.allergy.medicationClassId = medicationClassId;
        if (medicationClassId) {
            this.medicationClassService.getById(medicationClassId)
                .then(medicationClass => {
                    this.allergy.medication = medicationClass.name;

                    this.medicationNameId = null;
                    this.allergy.medicationNameId = null;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
        else {
            const previousMedicationClassId = $event.previousValue;
            if (previousMedicationClassId && !this.allergy.medicationNameId)
                this.allergy.medication = null;
        }
    }

    onMedicationNameChanged($event) {
        const medicationNameId = $event.value;
        this.allergy.medicationNameId = medicationNameId;
        if (medicationNameId) {
            this.medicationService.getNameByMedicationNameId(medicationNameId)
                .then(medicationNameObject => {
                    this.allergy.medication = medicationNameObject.name;

                    this.medicationClassId = null;
                    this.allergy.medicationClassId = null;
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
        else {
            const previousMedicationNameId = $event.previousValue;
            if (previousMedicationNameId && !this.allergy.medicationClassId)
                this.allergy.medication = null;
        }
    }

    private init(): any {
        this.initAllergyDataSource();
        this.initMedicationDataSource();
        this.initMedicationClassDataSource();
        this.initDefaultHistoryValue("allergieshistory");
    }

    private initSelectableLists() {
        const medicationReactionListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.medAllergy);

        const selectableLists = [
            medicationReactionListConfig
        ];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })

    }

    private initAllergyDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("allergy"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId
                }, this)
        });

        this.allergyDataSource.store = appointmentStore;
        this.applyDecoratorForDataSourceLoadFunc(appointmentStore)
    }

    private applyDecoratorForDataSourceLoadFunc(store: any) {
        const nativeLoadFunc = store.load;
        store.load = loadOptions => {
            return nativeLoadFunc.call(store, loadOptions)
                .then(result => {
                    result.forEach(item => {
                        item.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.createDate);
                    });
                    return result;
                });
        };
    }

    private setHistoryExistence() {
        this.allergyService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initMedicationDataSource(): void {
        this.medicationNameDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("medication/name"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private initMedicationClassDataSource(): void {
        this.medicationClassDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("medicationclass"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}