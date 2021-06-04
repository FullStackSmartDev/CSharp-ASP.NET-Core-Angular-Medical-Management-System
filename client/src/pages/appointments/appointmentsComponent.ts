import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DxSchedulerComponent, DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import * as moment from 'moment';
import { PatientDataPage } from '../patientData/patientData';
import { ToastService } from '../../provider/toastService';
import { BaseHistoryComponent } from '../../components/patientHistory/baseHistoryComponent';
import { LoadPanelService } from '../../provider/loadPanelService';
import { AlertService } from '../../provider/alertService';
import { AppointmentDataService, PatientDemographicDataService, EmployeeDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { AppointmentGridViewDataService, PatientAdmissionViewDataService } from '../../provider/dataServices/read/readDataServices';
import { EmployeeType } from '../../enums/employeeType';
import { Appointment } from '../../dataModels/appointment';
import { AppointmentGridView } from '../../dataModels/appointmentGridView';
import { AppointmentsFilter } from './appointmentsFilter';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import { DefaultValuesProvider } from '../../provider/defaultValuesProvider';
import { LookupItemsAppService } from '../../provider/appServices/lookupItemsAppService';

@Component({
    selector: 'page-appointments',
    templateUrl: 'appointmentsComponent.html'
})
export class AppointmentsPage extends BaseHistoryComponent implements OnInit {
    @ViewChild("appointmentScheduler") appointmentScheduler: DxSchedulerComponent;
    @ViewChild("appointmentsGrid") appointmentsGrid: DxDataGridComponent;

    appointmentData: any = {};

    isManageAllegationsPopupVisible: boolean = false;

    previousAdmissionsState: any = {}

    startDate: any;
    endDate: any;

    filter: AppointmentsFilter;

    isAdmissionPopupVisible: boolean = false;
    patientPreviousAdmissions: Array<any> = [];
    appointmentsFilter: any = {}

    locationDataSource: any = {};
    patientDataSource: any = {};
    physianDataSource: any = {};
    nurseDataSource: any = {};
    roomDataSource: any = {};
    appointmentDataSource: any = {};
    appointmentGridDataSource: any = {};

    schedulerAvailableViews: any = [
        'day',
        { type: 'week', dateCellTemplate: 'dateCellTemplate' },
        'month'
    ];

    get lookupItemNames(): string[] {
        return ["appointmentStatus"];
    };

    currentDate: Date = new Date();
    currentAppointmentView: string = "day";

    selectedAppointment: Array<any> = [];

    get isSingleSchedulerMode() {
        const appointmentSchedulerInstance = this.appointmentScheduler.instance;
        if (appointmentSchedulerInstance) {
            return appointmentSchedulerInstance.option("currentView") !== "day";
        }
        return this.currentAppointmentView !== "day";
    }

    constructor(public navCtrl: NavController,
        private lookupDataSourceProvider: LookupDataSourceProvider,
        private patientAdmissionViewDataService: PatientAdmissionViewDataService,
        private employeeDataService: EmployeeDataService,
        private appointmentDataService: AppointmentDataService,
        private patientDemographicDataService: PatientDemographicDataService,
        private appointmentGridViewDataService: AppointmentGridViewDataService,
        loadPanelService: LoadPanelService,
        alertService: AlertService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider) {

        super(alertService, loadPanelService,
            toastService, defaultValuesProvider, lookupItemsAppService);

        this.onManageAllegationsBtnClick = this.onManageAllegationsBtnClick.bind(this);
    }

    hasPatientPreviousAdmissions(appoinmentId, patientId) {
        const patientAppointmentKey =
            this.getPatientAppointmentKey(patientId, appoinmentId);
        return this.previousAdmissionsState[patientAppointmentKey];
    }

    onPreviousAdmissionSelected($event) {
        const addedItems = $event.addedItems;
        if (!addedItems.length) {
            return;
        }

        const selectedAdmission = addedItems[0];
        this.patientPreviousAdmissions = [];
        this.isAdmissionPopupVisible = false;

        this.navCtrl.push(PatientDataPage, { appoinmentId: selectedAdmission.Id })
    }

    showPreviousAdmissions($event: any, patientId: string, startDate: any) {
        $event.event.stopPropagation()

        const filter = [
            ["PatientId", "=", patientId],
            "and",
            ["StartDate", "<", startDate]
        ];

        const sort = [
            {
                selector: "StartDate",
                desc: true
            }
        ];

        const loadOptions = {
            sort: sort,
            filter: filter
        }

        this.appointmentGridViewDataService
            .search(loadOptions)
            .then(admissions => {
                this.patientPreviousAdmissions = admissions;
                this.isAdmissionPopupVisible = true;
            })
    }

    onAppointmentClick($event) {
        const currentView = this.appointmentScheduler.instance.option().currentView;
        if (currentView === "month" || currentView === "week") {
            $event.cancel = true;
            const selectedDateOnMonthView = $event.appointmentData.startDate;
            if (selectedDateOnMonthView) {
                this.appointmentScheduler.instance.option("currentDate", selectedDateOnMonthView);
                this.currentDate = selectedDateOnMonthView;
                this.appointmentScheduler.instance.option("currentView", "day");
            }
        }
    }

    onAppointmentChanged($event) {
        let selectedAppointemnt = $event.selectedRowsData[0];
        if (!selectedAppointemnt)
            return;

        const appointmentInfo = {
            appointmentId: selectedAppointemnt.Id,
            appointmentStartDate: selectedAppointemnt.StartDate
        }

        this.navCtrl.push(PatientDataPage, { appointmentInfo: appointmentInfo });
    }

    onAppointmentFormCreated(data) {
        const form = data.form;

        const appointmentData = data.appointmentData;
        this.appointmentData = appointmentData;

        let locationId = "";
        if (appointmentData.LocationId) {
            locationId = appointmentData.LocationId;
        }

        form.option("items", [
            {
                label: {
                    text: "Patient"
                },
                editorType: "dxLookup",
                dataField: "PatientId",
                isRequired: true,
                editorOptions: {
                    dataSource: this.patientDataSource,
                    displayExpr: this.getPatientLookupDisplayExpression,
                    valueExpr: "Id"
                }
            },
            {
                label: {
                    text: "Location"
                },
                isRequired: true,
                editorType: "dxLookup",
                dataField: "LocationId",
                editorOptions: {
                    dataSource: this.locationDataSource,
                    displayExpr: "Name",
                    valueExpr: "Id",
                    onValueChanged: function (args) {
                        const locationId = args.value;
                        if (locationId) {
                            const roomDataSource = this.lookupDataSourceProvider
                                .getRoomLookupDataSource(locationId);

                            const roomLookup = form.getEditor("RoomId");
                            roomLookup.option("value", null);
                            roomLookup.option("dataSource", { store: roomDataSource });
                        }
                    }.bind(this)
                }
            },
            {
                label: {
                    text: "Room"
                },
                isRequired: true,
                dataField: "RoomId",
                editorType: "dxLookup",
                editorOptions: {
                    displayExpr: "Name",
                    valueExpr: "Id",
                    dataSource: locationId
                        ? this.lookupDataSourceProvider.getRoomLookupDataSource(locationId)
                        : []
                }
            },
            {
                label: {
                    text: "Physician"
                },
                editorType: "dxLookup",
                dataField: "PhysicianId",
                isRequired: true,
                editorOptions: {
                    dataSource: this.getEmployeeDataSource(EmployeeType.Physician),
                    displayExpr: this.getEmployeeLoookupDisplayExpression,
                    valueExpr: "Id"
                }
            },
            {
                label: {
                    text: "Nurse"
                },
                isRequired: true,
                editorType: "dxLookup",
                dataField: "NurseId",
                editorOptions: {
                    dataSource: this.getEmployeeDataSource(EmployeeType.Nurse),
                    displayExpr: this.getEmployeeLoookupDisplayExpression,
                    valueExpr: "Id"
                }
            },
            {
                label: {
                    text: "Status"
                },
                isRequired: true,
                dataField: "AppointmentStatus",
                editorType: "dxSelectBox",
                editorOptions: {
                    items: this["appointmentStatus"].values
                }
            },
            {
                label: {
                    text: "Start Date"
                },
                isRequired: true,
                dataField: "startDate",
                editorType: "dxDateBox",
                editorOptions: {
                    type: "datetime",
                    readOnly: true
                }
            },
            {
                label: {
                    text: "End Date"
                },
                isRequired: true,
                dataField: "endDate",
                editorType: "dxDateBox",
                editorOptions: {
                    type: "datetime",
                    readOnly: true
                }
            },
            {
                label: {
                    text: "Allegations"
                },
                isRequired: false,
                editorType: "dxButton",
                editorOptions: {
                    text: "Manage Allegations",
                    onClick: this.onManageAllegationsBtnClick
                }
            }
        ]);
    }

    appointmentSchedulerOptionChanged() {
        const currentView = this.appointmentScheduler
            .instance.option().currentView;

        this.currentAppointmentView = currentView;
    }

    onAppointmentAdded() {
        this.refreshRelatedSchedulerComponents();
    }

    onAppointmentUpdated() {
        this.refreshRelatedSchedulerComponents();
    }

    ngOnInit() {
        this.init();
    }

    ionViewDidEnter() {
        this.selectedAppointment = [];
        this.appointmentsGrid.instance
            .refresh();
    }

    onFilterChanged(filter: any) {
        this.filter = filter;

        this.appointmentsGrid
            .instance.refresh();

        this.appointmentScheduler
            .instance.getDataSource().reload()
    }

    private onManageAllegationsBtnClick($event) {
        this.isManageAllegationsPopupVisible = true;
    }

    private getEmployeeLoookupDisplayExpression(item) {
        if (!item)
            return "";
        return `${item.FirstName} ${item.LastName}`;
    }

    private getPatientLookupDisplayExpression(item) {
        if (!item)
            return "";
        const dob = moment(item.DateOfBirth)
            .format('LL')
        return `${item.FirstName} ${item.LastName} / ${dob} / ${item.Ssn}`;
    }

    private refreshRelatedSchedulerComponents() {
        if (this.appointmentsGrid) {
            this.appointmentsGrid.instance.refresh();
        }
    }

    private init() {
        this.initLocationDataSource();
        this.initPatientDataSource();
        this.initAppointmentGridDataSource();
        this.initAppointmentDataSource();
    }

    private initAppointmentGridDataSource() {
        const self = this;
        this.appointmentGridDataSource.store = new CustomStore({
            load: (loadOptions) => {

                if (!self.startDate || !self.endDate) {
                    return {
                        data: [],
                        totalCount: 0
                    }
                }

                const appointmentsFilter = self
                    .getAppointmentsFilter();

                loadOptions.filter = appointmentsFilter;

                loadOptions.sort = [
                    {
                        selector: "StartDate",
                        desc: false
                    }
                ];

                return self.appointmentGridViewDataService
                    .searchWithCount(loadOptions, "Id")
                    .then(result => {
                        const appointments = result.data;
                        appointments.forEach(appointment => {
                            const patientAppointmentKey =
                                self.getPatientAppointmentKey(appointment.PatientId, appointment.Id);

                            self.previousAdmissionsState[patientAppointmentKey] = false;

                            self.updatePatientPreviousAdmissionsState(appointment.StartDate,
                                appointment.PatientId, patientAppointmentKey);
                        });

                        return result;
                    });
            }
        });
    }

    private updatePatientPreviousAdmissionsState(startDate, patientId, patientAppointmentKey) {
        const loadOptions = {
            filter: [
                ["StartDate", "<", startDate],
                "and",
                ["PatientId", "=", patientId]
            ],
            sort: [
                {
                    selector: "StartDate",
                    desc: false
                }
            ]
        }

        this.patientAdmissionViewDataService
            .count(loadOptions, "AppointmentId")
            .then(result => {
                this.previousAdmissionsState[patientAppointmentKey] =
                    !!result;
            });
    }

    private getPatientAppointmentKey(patientId, appointmentId) {
        return `${patientId}_${appointmentId}`;
    }

    private initAppointmentDataSource(): any {
        this.appointmentDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key) return Promise.resolve();

                const loadOptions = {
                    filter: ["Id", "=", key]
                }
                return this.appointmentGridViewDataService
                    .firstOrDefault(loadOptions);
            },
            load: (loadOptions: any) => {
                const startDate = loadOptions.dxScheduler.startDate;
                const endDate = loadOptions.dxScheduler.endDate;

                this.startDate = startDate;
                this.endDate = endDate;

                if (this.appointmentsGrid.instance) {
                    this.appointmentsGrid
                        .instance.refresh();
                }

                const appointmentsFilter = this.getAppointmentsFilter();
                appointmentsFilter.push("and");
                appointmentsFilter.push(["IsDelete", "=", false]);

                loadOptions.filter = appointmentsFilter;

                return this.appointmentGridViewDataService
                    .search(loadOptions)
                    .then((appointments) => {
                        return appointments.map(a => {
                            const appointmentView = new AppointmentGridView()
                                .createFromEntityModel(a);

                            appointmentView["text"] =
                                `Patient: ${a.PatientFirstName} ${a.PatientLastName}`;

                            appointmentView["startDate"] = appointmentView.StartDate;
                            appointmentView["endDate"] = appointmentView.EndDate;

                            return appointmentView;
                        });
                    })
                    .catch(error => console.log(error));
            },
            insert: (appointment) => {
                const newAppointment = new Appointment();

                newAppointment.StartDate = appointment.startDate;
                newAppointment.EndDate = appointment.endDate;
                newAppointment.PatientDemographicId = appointment.PatientId;
                newAppointment.LocationId = appointment.LocationId;
                newAppointment.RoomId = appointment.RoomId;
                newAppointment.NurseId = appointment.NurseId;
                newAppointment.PhysicianId = appointment.PhysicianId;
                newAppointment.AppointmentStatus = appointment.AppointmentStatus;
                newAppointment.Allegations = this.appointmentData.Allegations
                    ? this.appointmentData.Allegations
                    : null;

                //hardcoded - need to change to corresponding company id
                newAppointment.CompanyId = "EC3A7738-0E2A-4045-8841-420D9F14BECF";

                newAppointment.convertToEntityModel();

                return this.appointmentDataService.
                    create(newAppointment)
                    .then(() => {
                        this.appointmentData = {};
                    });
            },
            update: (oldAppointment, modifiedAppointment) => {
                const newAppointment = new Appointment(modifiedAppointment.Id, modifiedAppointment.IsDelete);

                newAppointment.StartDate = modifiedAppointment.startDate;
                newAppointment.EndDate = modifiedAppointment.endDate;
                newAppointment.PatientDemographicId = modifiedAppointment.PatientId;
                newAppointment.LocationId = modifiedAppointment.LocationId;
                newAppointment.RoomId = modifiedAppointment.RoomId;
                newAppointment.NurseId = modifiedAppointment.NurseId;
                newAppointment.PhysicianId = modifiedAppointment.PhysicianId;
                newAppointment.AppointmentStatus = modifiedAppointment.AppointmentStatus;
                newAppointment.Allegations = this.appointmentData.Allegations
                    ? this.appointmentData.Allegations
                    : null;

                //hardcoded - need to change to corresponding company id
                newAppointment.CompanyId = "EC3A7738-0E2A-4045-8841-420D9F14BECF";

                newAppointment.convertToEntityModel();

                return this.appointmentDataService.
                    update(newAppointment)
                    .then(() => {
                        this.appointmentData = {};
                    });
            },
            remove: (appointment: any) => {
                return {}
            }
        });
    }

    private getAppointmentsFilter(): Array<any> {
        const filter = [];

        const startDateFilter = ["StartDate", ">=", this.startDate];
        const endDateFilter = ["EndDate", "<=", this.endDate];

        filter.push(startDateFilter);
        filter.push("and");
        filter.push(endDateFilter);

        if (this.filter) {
            const locationId = this.filter.Location;
            if (locationId) {
                filter.push("and");
                const locationDateFilter =
                    ["LocationId", "=", locationId];
                filter.push(locationDateFilter);
            }

            const physicianId = this.filter.Physician;
            if (physicianId) {
                filter.push("and");
                const physicianDateFilter =
                    ["PhysicianId", "=", physicianId];
                filter.push(physicianDateFilter);
            }

            const patientId = this.filter.Patient;
            if (patientId) {
                filter.push("and");
                const patientDateFilter =
                    ["PatientId", "=", patientId];
                filter.push(patientDateFilter);
            }
        }

        return filter;
    }

    private getEmployeeDataSource(employeeType: number) {
        return {
            store: new CustomStore({
                byKey: (key) => {
                    if (!key)
                        return Promise.resolve();

                    return this.employeeDataService
                        .getById(key);
                },
                load: (loadOptions: any) => {
                    const employeeTypeFilter = ["EmployeeType", "=", employeeType];
                    const isDeleteFilter = ["IsActive", "=", true];

                    const takeItemCount = this.applicationConfiguration
                        .defaultPageSizeCount
                    loadOptions.take = takeItemCount;

                    const searchOperation = loadOptions.searchOperation;
                    const searchValue = loadOptions.searchValue;

                    const filter = [employeeTypeFilter, "and", isDeleteFilter];

                    if (searchOperation && searchValue) {
                        filter.push("and");
                        filter.push(["LastName", searchOperation, searchValue]);
                    }

                    loadOptions.filter = filter;

                    return this.employeeDataService
                        .search(loadOptions);
                }
            })
        }
    }

    private initLocationDataSource() {
        this.locationDataSource.store = this.lookupDataSourceProvider
            .locationLookupDataSource;
    }

    private initPatientDataSource(): any {
        this.patientDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.patientDemographicDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const isDeleteFilter = ["IsDelete", "=", false];

                const takeItemCount = this.applicationConfiguration.defaultPageSizeCount

                loadOptions.take = takeItemCount;

                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchOperation && searchValue) {
                    const lastNameFilter = ["LastName", searchOperation, searchValue];
                    loadOptions.filter = [
                        lastNameFilter,
                        "and",
                        isDeleteFilter
                    ];
                }
                return this.patientDemographicDataService
                    .search(loadOptions);
            }
        });
    }
}

