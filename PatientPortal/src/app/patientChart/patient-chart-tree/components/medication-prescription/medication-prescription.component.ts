import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { MedicationPrescription } from "src/app/patientChart/models/medicationPrescription";
import { AlertService } from "src/app/_services/alert.service";
import { MedicationPrescriptionService } from "src/app/patientChart/patient-chart-tree/services/medication-prescription.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { MedicationService } from "src/app/_services/medication.service";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { BaseHistoryComponent } from "../patient-history/base-history.component";
import { MedicationItemInfo } from "src/app/patientChart/models/medicationItemInfo";
import { MedicationItemInfoView } from "src/app/patientChart/models/medicationItemInfoView";
import { AllergyService } from "../../services/allergy.service";
import { AllergyOnMedication } from "src/app/patientChart/models/allergyOnMedication";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from "src/app/_classes/predefinedSelectableListsNames";

@Component({
    templateUrl: "medication-prescription.component.html",
    selector: "medication-prescription"
})
export class MedicationPrescriptionComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() admissionId: string;
    @Input() isSignedOff: boolean;
    @Input("companyId") companyId: string;

    @ViewChild("medicationPrescriptionDataGrid", { static: false }) medicationPrescriptionDataGrid: DxDataGridComponent;
    @ViewChild("medicationPrescriptionPopup", { static: false }) medicationPrescriptionPopup: DxPopupComponent;
    @ViewChild("medicationPrescriptionForm", { static: false }) medicationPrescriptionForm: DxFormComponent;

    canRenderComponent: boolean = false;

    allergyOnMedication: AllergyOnMedication = null;

    medicationItemInfo: MedicationItemInfoView = null;
    medicationNameId: string = null;

    isMedicationPrescriptionPopupOpened: boolean = false;

    isPrescriptionExist: boolean = false;

    selectedMedicationPrescription: Array<any> = [];
    medicationPrescription: MedicationPrescription;

    isNewMedicationPrescription: boolean = true;

    medicationPrescriptionDataSource: any = {};
    medicationNameDataSource: any = {};

    constructor(private alertService: AlertService,
        private medicationPrescriptionService: MedicationPrescriptionService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        private medicationService: MedicationService,
        private allergyService: AllergyService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    get allergyWarningMessage(): string {
        return this.allergyOnMedication.medicationClass && this.allergyOnMedication.medicationClassId
            ? `WARNING! Patient has allergy on the whole class of medications: ${this.allergyOnMedication.medicationClass}!`
            : "WARNING! Patient has allergy on the selected medication!"
    }

    get patientHasAllergyOnMedication(): boolean {
        return !!this.allergyOnMedication;
    };

    get medicationPrescriptionFormHeight(): number {
        return this.patientHasAllergyOnMedication ? 400 : 440;
    };

    get prescriptionDurationInDays(): any {
        const startDate = this.medicationPrescription.startDate;
        const endDate = this.medicationPrescription.endDate;

        if (!startDate || !endDate)
            return "";

        if (startDate >= endDate)
            return "";

        return DateHelper.getDaysBetween(startDate, endDate);
    }

    onMedicationPrescriptionFieldChanged($event) {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        if (dataField === "sigSelection" && fieldValue) {
            if (!this.medicationPrescription.sig) {
                this.medicationPrescription.sig = fieldValue;
            }
            else {
                this.medicationPrescription.sig += ` ${fieldValue}`;
            }
        }
    }

    onMedicationNameChanged($event): void {
        const medicationNameId = $event.value;

        this.medicationNameId = medicationNameId;

        if (!medicationNameId) {
            this.medicationItemInfo = null;
            this.allergyOnMedication = null;
            this.resetMedicationPrescriptionFields();
            this.medicationPrescriptionForm
                .instance.repaint();
        }
        else {
            const medicationNamePromise = this.medicationService
                .getNameByMedicationNameId(medicationNameId);

            const medicationInfoPromise = this.medicationService
                .getMedicationInfo(medicationNameId);

            const medicationAllergiesPromise =
                this.allergyService.getPatientAllergyOnMedication(this.patientId, medicationNameId);

            Promise.all([medicationNamePromise, medicationInfoPromise, medicationAllergiesPromise])
                .then(result => {
                    const medicationName = result[0];
                    const medicationInfo = result[1];
                    this.allergyOnMedication = result[2];

                    this.medicationItemInfo = medicationInfo;
                    this.medicationPrescriptionForm
                        .instance.repaint();
                    this.resetMedicationPrescriptionFields(medicationName.name, medicationName.id);
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    get isMedicationSelected(): boolean {
        return !!this.medicationItemInfo;
    }

    get medicationUnitsListValues(): string[] {
        return this.medicationItemInfo
            ? this.medicationItemInfo.unitList
            : this.selectableListService
                .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.medUnits);
    }

    get medicationRouteListValues(): string[] {
        return this.medicationItemInfo
            ? this.medicationItemInfo.routeList
            : this.selectableListService
                .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.medRoute);
    }

    get medicationDoseScheduleListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.medDoseSchedule);
    }

    get medicationStatusListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.medStatus)
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.medicationPrescriptionPopup);
    }

    deletePrescription(medicationPrescription: MedicationPrescription, $event) {
        $event.stopPropagation();
        const medicationPrescriptionId = medicationPrescription.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete prescription ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.medicationPrescriptionService.delete(medicationPrescriptionId)
                    .then(() => {
                        this.medicationPrescriptionDataGrid.instance.refresh();
                        this.setPrescriptionExistence();
                    });

            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setPrescriptionExistence();
        this.medicationPrescription =
            new MedicationPrescription(this.patientId, this.admissionId);
    }

    openMedicationPrescriptionForm() {
        this.isMedicationPrescriptionPopupOpened = true;
    }

    onMedicationPrescriptionPopupHidden() {
        this.isNewMedicationPrescription = true;;
        this.selectedMedicationPrescription = [];
        this.medicationPrescription = new MedicationPrescription(this.patientId, this.admissionId);
        this.medicationItemInfo = null;
        this.medicationNameId = null;
        this.allergyOnMedication = null;
    }

    createUpdateMedicationPrescription() {
        const validationResult = this.medicationPrescriptionForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isMedicationSelected) {
            const medicationItemInfo =
                new MedicationItemInfo(this.medicationPrescription.medicationNameId,
                    this.medicationPrescription.route, this.medicationPrescription.dose, this.medicationPrescription.dosageForm,
                    this.medicationPrescription.units);

            this.medicationService.getMedicationConfigurationExistence(medicationItemInfo)
                .then(medicationConfigurationExistence => {
                    const isMedicationConfigurationExist = medicationConfigurationExistence.exist;
                    if (!isMedicationConfigurationExist) {
                        const errorMessage = `Medication with such cofiguration:<br/><br/>
                                              ROUTE ---------- ${medicationConfigurationExistence.route}<br/>
                                              DOSE ----------- ${medicationConfigurationExistence.strength}<br/>
                                              UNITS ---------- ${medicationConfigurationExistence.unit}<br/>
                                              DOSAGE FORM - ${medicationConfigurationExistence.dosageForm}<br/><br/>
                                              cannot be found. Try to use another configuration`;
                        this.alertService.error(errorMessage);
                    }
                    else {
                        this.saveMedicationPrescription();
                    }
                });
        }
        else {
            this.saveMedicationPrescription();
        }
    }

    private saveMedicationPrescription(): void {
        this.medicationPrescriptionService.save(this.medicationPrescription)
            .then(() => {
                if (this.medicationPrescriptionDataGrid && this.medicationPrescriptionDataGrid.instance) {
                    this.medicationPrescriptionDataGrid
                        .instance.refresh();
                }

                this.isPrescriptionExist = true;
                this.isMedicationPrescriptionPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onMedicationPrescriptionSelect($event) {
        if (this.isSignedOff) {
            this.selectedMedicationPrescription = [];
            return;
        }

        const selectedMedicationPrescription = $event.selectedRowsData[0];
        if (!selectedMedicationPrescription)
            return;

        const selectedMedicationPrescriptionId = selectedMedicationPrescription.id;

        this.medicationPrescriptionService.getById(selectedMedicationPrescriptionId)
            .then((medicationPrescription) => {
                this.medicationPrescription = medicationPrescription;

                const medicationNameId = medicationPrescription.medicationNameId;
                this.medicationNameId = medicationNameId;

                if (medicationNameId) {
                    this.medicationService.getMedicationInfo(medicationNameId)
                        .then(medicationItemInfo => {
                            this.medicationItemInfo = medicationItemInfo;
                            this.isMedicationPrescriptionPopupOpened = true;
                            this.isNewMedicationPrescription = false;
                        })
                }
                else {
                    this.isMedicationPrescriptionPopupOpened = true;
                    this.isNewMedicationPrescription = false;
                }
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initMedicationPrescriptionDataSource();
        this.initMedicationNameDataSource();
        this.initDefaultHistoryValue("medicationshistory");
    }

    private initSelectableLists() {
        const medicationUnitsListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.medUnits);
        const medicationRouteListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.medRoute);
        const medicationDoseScheduleListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.medDoseSchedule);
        const medicationStatusListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.medStatus);

        const selectableLists = [
            medicationUnitsListConfig,
            medicationRouteListConfig,
            medicationDoseScheduleListConfig,
            medicationStatusListConfig
        ];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
    }

    private initMedicationPrescriptionDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("prescription"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                    jQueryAjaxSettings.data.admissionId = this.admissionId;
                }, this)
        });

        this.medicationPrescriptionDataSource.store = appointmentStore;
        this.applyDecoratorForDataSourceLoadFunc(appointmentStore)
    }

    private applyDecoratorForDataSourceLoadFunc(store: any) {
        const nativeLoadFunc = store.load;
        store.load = loadOptions => {
            return nativeLoadFunc.call(store, loadOptions)
                .then(result => {
                    result.forEach(item => {
                        item.startDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.startDate);
                        item.endDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.endDate);
                    });
                    return result;
                });
        };
    }

    private setPrescriptionExistence() {
        this.medicationPrescriptionService.isPrescriptionExist(this.admissionId)
            .then(isPrescriptionExist => {
                this.isPrescriptionExist = isPrescriptionExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initMedicationNameDataSource(): void {
        this.medicationNameDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("medication/name"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private resetMedicationPrescriptionFields(medication: string = "", medicationNameId: string = "") {
        this.medicationPrescription.medication = medication;
        this.medicationPrescription.medicationNameId = medicationNameId;
        this.medicationPrescription.dosageForm = "";
        this.medicationPrescription.dose = "";
        this.medicationPrescription.route = "";
        this.medicationPrescription.units = "";
    }
}