import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { BaseHistoryComponent } from "../base-history.component";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from "devextreme-angular";
import { MedicationHistory } from "src/app/patientChart/models/medicationHistory";
import { AlertService } from "src/app/_services/alert.service";
import { MedicationHistoryService } from "src/app/patientChart/patient-chart-tree/services/medication-history.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DateHelper } from "src/app/_helpers/date.helper";
import { MedicationService } from "src/app/_services/medication.service";
import { DefaultValueService } from "src/app/_services/default-value.service";
import { MedicationItemInfoView } from "src/app/patientChart/models/medicationItemInfoView";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from 'src/app/_classes/predefinedSelectableListsNames';

@Component({
    templateUrl: "medication-history.component.html",
    selector: "medication-history"
})
export class MedicationHistoryComponent extends BaseHistoryComponent implements OnInit, AfterViewInit {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("medicationHistoryDataGrid", { static: false }) medicationHistoryDataGrid: DxDataGridComponent;
    @ViewChild("medicationHistoryPopup", { static: false }) medicationHistoryPopup: DxPopupComponent;
    @ViewChild("medicationHistoryForm", { static: false }) medicationHistoryForm: DxFormComponent;

    canRenderComponent: boolean = false;

    medicationItemInfo: MedicationItemInfoView = null;
    medicationNameId: string = null;

    isMedicationHistoryPopupOpened: boolean = false;

    isHistoryExist: boolean = false;

    selectedMedicationHistory: Array<any> = [];
    medicationHistory: MedicationHistory;

    isNewMedicationHistory: boolean = true;

    medicationHistoryDataSource: any = {};
    medicationNameDataSource: any = {};

    constructor(private alertService: AlertService,
        private medicationHistoryService: MedicationHistoryService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        private medicationService: MedicationService,
        defaultValueService: DefaultValueService,
        private devextremeAuthService: DevextremeAuthService) {
        super(defaultValueService);

        this.init();
    }

    onPhraseSuggestionApplied($event) {
        this.medicationHistory.notes = $event;
    }

    onMedicationNameChanged($event): void {
        const medicationNameId = $event.value;

        this.medicationNameId = medicationNameId;

        if (!medicationNameId) {
            this.medicationItemInfo = null;
            this.resetMedicationPrescriptionFields();
            this.medicationHistoryForm.instance.repaint();
        }
        else {
            const medicationNamePromise = this.medicationService
                .getNameByMedicationNameId(medicationNameId);

            const medicationInfoPromise = this.medicationService
                .getMedicationInfo(medicationNameId);

            Promise.all([medicationNamePromise, medicationInfoPromise])
                .then(result => {
                    const medicationName = result[0];
                    const medicationInfo = result[1];

                    this.medicationItemInfo = medicationInfo;
                    this.medicationHistoryForm.instance.repaint();

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
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.medStatus);
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.medicationHistoryPopup);
    }

    deleteHistory(medicationHistory: MedicationHistory, $event) {
        $event.stopPropagation();
        const medicationHistoryId = medicationHistory.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the history ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.medicationHistoryService.delete(medicationHistoryId)
                    .then(() => {
                        this.medicationHistoryDataGrid.instance.refresh();
                        this.setHistoryExistence();
                    });

            }
        });
    }

    ngOnInit(): void {
        this.initSelectableLists();
        this.setHistoryExistence();
        this.medicationHistory = new MedicationHistory(this.patientId);
    }

    openMedicationHistoryForm() {
        this.isMedicationHistoryPopupOpened = true;
    }

    onMedicationHistoryPopupHidden() {
        this.isNewMedicationHistory = true;;
        this.selectedMedicationHistory = [];
        this.medicationHistory = new MedicationHistory(this.patientId);
        this.medicationItemInfo = null;
        this.medicationNameId = null;
    }

    createUpdateMedicationHistory() {
        const validationResult = this.medicationHistoryForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.saveMedicationHistory();
    }

    onMedicationHistorySelect($event) {
        if (this.isSignedOff) {
            this.selectedMedicationHistory = [];
            return;
        }

        const selectedMedicationHistory = $event.selectedRowsData[0];
        if (!selectedMedicationHistory)
            return;

        const selectedMedicationHistoryId = selectedMedicationHistory.id;

        this.medicationHistoryService.getById(selectedMedicationHistoryId)
            .then((medicationHistory) => {
                this.medicationHistory = medicationHistory;

                const medicationNameId = medicationHistory.medicationNameId;
                this.medicationNameId = medicationNameId;

                if (medicationNameId) {
                    this.medicationService.getMedicationInfo(medicationNameId)
                        .then(medicationItemInfo => {
                            this.medicationItemInfo = medicationItemInfo;
                            this.isMedicationHistoryPopupOpened = true;
                            this.isNewMedicationHistory = false;
                        })
                }
                else {
                    this.isMedicationHistoryPopupOpened = true;
                    this.isNewMedicationHistory = false;
                }
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private saveMedicationHistory(): void {
        this.medicationHistoryService.save(this.medicationHistory)
            .then(() => {
                if (this.medicationHistoryDataGrid && this.medicationHistoryDataGrid.instance) {
                    this.medicationHistoryDataGrid
                        .instance.refresh();
                }

                this.isHistoryExist = true;
                this.isMedicationHistoryPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initMedicationHistoryDataSource();
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
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initMedicationHistoryDataSource(): any {
        const appointmentStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("medicationhistory"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                }, this)
        });

        this.medicationHistoryDataSource.store = appointmentStore;
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
        this.medicationHistoryService.isHistoryExist(this.patientId)
            .then(isHistoryExist => {
                this.isHistoryExist = isHistoryExist;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private resetMedicationPrescriptionFields(medication: string = "", medicationNameId: string = "") {
        this.medicationHistory.medication = medication;
        this.medicationHistory.medicationNameId = medicationNameId;
        this.medicationHistory.dosageForm = "";
        this.medicationHistory.dose = "";
        this.medicationHistory.route = "";
        this.medicationHistory.units = "";
    }

    private initMedicationNameDataSource(): void {
        this.medicationNameDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("medication/name"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}