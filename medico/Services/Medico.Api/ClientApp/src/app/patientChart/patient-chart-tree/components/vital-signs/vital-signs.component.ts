import { Component, Input, ViewChild } from '@angular/core';
import { SearchConfiguration } from 'src/app/_classes/searchConfiguration';
import { DxPopupComponent, DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { VitalSigns } from 'src/app/patientChart/models/vitalSigns';
import { AlertService } from 'src/app/_services/alert.service';
import { PatientChartTrackService } from '../../../../_services/patient-chart-track.service';
import { SelectableListConfig } from 'src/app/_models/selectableListConfig';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { VitalSignsService } from '../../services/vital-signs.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { SelectableListsNames } from 'src/app/_classes/selectableListsNames';
import { LibrarySelectableListIds } from 'src/app/_classes/librarySelectableListIds';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

@Component({
    templateUrl: 'vital-signs.component.html',
    selector: "vital-signs"
})
export class VitalSignsComponent {
    @Input() patientId: string;
    @Input() admissionId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    searchConfiguration: SearchConfiguration = new SearchConfiguration();

    @ViewChild("vitalSignsDataGrid", { static: false }) vitalSignsDataGrid: DxDataGridComponent;
    @ViewChild("vitalSignsPopup", { static: false }) vitalSignsPopup: DxPopupComponent;
    @ViewChild("vitalSignsForm", { static: false }) vitalSignsForm: DxFormComponent;

    vitalSignTabs: any[] = [
        { id: 1, title: 'Base Vital Signs', template: "baseVitalSignsTemplate" },
        { id: 2, title: 'Vital Signs', template: "vitalSignsTemplate" },
        { id: 3, title: 'Vision', template: "visionTemplate" },
        { id: 4, title: 'Notes', template: "notesTemplate" }
    ];

    canRenderComponent: boolean = false;

    lastVitalSigns: VitalSigns;

    selectedVitalSigns: Array<any> = [];
    vitalSigns: VitalSigns = null;
    isNewVitalSigns: boolean = true;

    vitalSignsDataSource: any = {};

    isVitalSignsPopupOpened: boolean = false;

    constructor(private alertService: AlertService,
        private vitalSignsService: VitalSignsService,
        private patientChartTrackService: PatientChartTrackService,
        private selectableListService: SelectableListService,
        private dxDataUrlService: DxDataUrlService,
        private appointmentService: AppointmentService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    get bloodPressurePositionListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, SelectableListsNames.vitalSigns.bloodPressurePosition);
    }

    get bloodPressureLocationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, SelectableListsNames.vitalSigns.bloodPressureLocation);
    }

    get oxygenSaturationTestListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, SelectableListsNames.vitalSigns.oxygenSaturationTest);
    }

    ngOnInit(): void {
        this.init();
    }

    openVitalSignsCreationForm() {
        this.isVitalSignsPopupOpened = true;
    }

    onVitalSignsPopupShowing() {
        if (this.isNewVitalSigns)
            this.setVitalSignsDefaultValues();
    }

    onVitalSignsPopupHidden() {
        this.resetVitalSignsForm();
        this.selectedVitalSigns = [];
    }

    createUpdateVitalSigns() {
        this.vitalSignsService.save(this.vitalSigns)
            .then(() => {
                this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.VitalSignsNode);
                this.vitalSignsDataGrid.instance.refresh();
                this.resetVitalSignsForm();
                this.isVitalSignsPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onSelectedVitalSigns($event) {
        if (this.isSignedOff) {
            this.selectedVitalSigns = [];
            return;
        }

        const selectedVitalSigns = $event.selectedRowsData[0];
        if (!selectedVitalSigns)
            return;

        const selectedVitalSignsId = selectedVitalSigns.id;

        this.vitalSignsService
            .getById(selectedVitalSignsId)
            .then((vitalSigns) => {
                this.vitalSigns = vitalSigns;
                this.isVitalSignsPopupOpened = true;
                this.isNewVitalSigns = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initSelectableLists() {
        const bloodPressurePositionListConfig =
            new SelectableListConfig(this.companyId, SelectableListsNames.vitalSigns.bloodPressurePosition,
                LibrarySelectableListIds.vitalSigns.bloodPressurePosition);

        const bloodPressureLocationListConfig =
            new SelectableListConfig(this.companyId, SelectableListsNames.vitalSigns.bloodPressureLocation,
                LibrarySelectableListIds.vitalSigns.bloodPressureLocation);

        const oxygenSatTestListConfig =
            new SelectableListConfig(this.companyId, SelectableListsNames.vitalSigns.oxygenSaturationTest,
                LibrarySelectableListIds.vitalSigns.oxygenSaturationTest);

        const selectableLists = [
            bloodPressurePositionListConfig,
            bloodPressureLocationListConfig,
            oxygenSatTestListConfig
        ];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canRenderComponent = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private setVitalSignsDefaultValues() {

        this.vitalSigns.bloodPressureLocation = this.selectableListService
            .getSelectableListDefaultValueFromComponent(this, SelectableListsNames.vitalSigns.bloodPressureLocation);

        this.vitalSigns.bloodPressurePosition = this.selectableListService
            .getSelectableListDefaultValueFromComponent(this, SelectableListsNames.vitalSigns.bloodPressurePosition);

        this.vitalSigns.oxygenSaturationAtRest = this.selectableListService
            .getSelectableListDefaultValueFromComponent(this, SelectableListsNames.vitalSigns.oxygenSaturationTest);
    }

    private resetVitalSignsForm() {
        this.isNewVitalSigns = true;
        this.initNewVitalSigns();
    }

    private init(): any {
        this.initSelectableLists();
        this.initNewVitalSigns();
        this.setLastVitalSigns();
        this.initVitalSignsDataSource();
    }

    private setLastVitalSigns() {
        this.appointmentService.getByAdmissionId(this.admissionId)
            .then(appointment => {
                if (appointment) {
                    const createDate = appointment.startDate;
                    this.vitalSignsService.getLast(this.patientId, createDate)
                        .then(vitalSigns => {
                            if (vitalSigns)
                                this.lastVitalSigns = vitalSigns;
                        })
                        .catch(error => this.alertService.error(error.message ? error.message : error));
                }
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initNewVitalSigns() {
        const vitalSigns = new VitalSigns();
        vitalSigns.admissionId = this.admissionId;
        vitalSigns.patientId = this.patientId;

        this.vitalSigns = vitalSigns;

    }

    private initVitalSignsDataSource(): any {
        const vitalSignsStore = createStore({
            key: "id",
            loadUrl: this.dxDataUrlService.getGridUrl("vitalsigns"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.patientId = this.patientId;
                    jQueryAjaxSettings.data.admissionId = this.admissionId;
                }, this)
        });

        this.vitalSignsDataSource.store = vitalSignsStore;
        this.applyDecoratorForDataSourceLoadFunc(vitalSignsStore)
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
}