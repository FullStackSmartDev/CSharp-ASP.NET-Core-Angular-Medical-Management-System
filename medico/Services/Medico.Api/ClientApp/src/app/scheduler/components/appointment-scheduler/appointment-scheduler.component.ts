import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { AppConfiguration } from "src/app/_classes/appConfiguration";
import { DxSchedulerComponent, DxDataGridComponent } from "devextreme-angular";
import { AppointmentsFilter } from "../../models/appointmentsFilter";
import { SearchConfiguration } from "src/app/_classes/searchConfiguration";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { GuidHelper } from "src/app/_helpers/guid.helper";
import { EmployeeTypeList } from "src/app/administration/classes/employeeTypeList";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { CompanyIdService } from "src/app/_services/company-id.service";
import { DateHelper } from "src/app/_helpers/date.helper";
import { AppointmentService } from "../../../_services/appointment.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { AlertService } from "src/app/_services/alert.service";
import { LibrarySelectableListIds } from 'src/app/_classes/librarySelectableListIds';
import { SelectableListsNames } from 'src/app/_classes/selectableListsNames';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';

@Component({
  selector: "appointment-scheduler",
  templateUrl: "./appointment-scheduler.component.html"
})
export class AppointmentSchedulerComponent implements OnInit, OnDestroy {
  @ViewChild("appointmentScheduler", { static: false }) appointmentScheduler: DxSchedulerComponent;
  @ViewChild("appointmentsGrid", { static: false }) appointmentsGrid: DxDataGridComponent;

  isAppointmentCreationFormOpened: boolean = false;
  areSelectableListsInitialized: boolean = false;

  currentOpenedAppointmentForm: any = null;

  companyId: string = "";
  companyIdSubscription: Subscription;

  allegationsString: string = "";

  selectedLocationId: string = GuidHelper.emptyGuid;

  appConfiguration: AppConfiguration = new AppConfiguration();
  searchConfiguration: SearchConfiguration = new SearchConfiguration();

  isManageAllegationsPopupVisible: boolean = false;

  startDate: any;
  endDate: any;

  filter: AppointmentsFilter = new AppointmentsFilter();

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
  patientChartDocumentDataSource: any = {};

  schedulerAvailableViews: any = ["day", "week", "month"];

  currentDate: Date = new Date();

  selectedAppointment: Array<any> = [];

  constructor(private dxDataUrlService: DxDataUrlService,
    private selectableListService: SelectableListService,
    private companyIdService: CompanyIdService,
    private appointmentService: AppointmentService,
    private router: Router,
    private devextremeAuthService: DevextremeAuthService,
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  get canRenderComponents(): boolean {
    return !!this.companyId && !!this.areSelectableListsInitialized;
  }

  onPreviousAdmissionSelected($event) {
    const addedItems = $event.addedItems;
    if (!addedItems.length) {
      return;
    }

    const selectedAdmission = addedItems[0];
    this.patientPreviousAdmissions = [];
    this.isAdmissionPopupVisible = false;

    this.router.navigate(["/patient-chart", selectedAdmission.id]);
  }

  showPreviousAdmissions($event: any, patientId: string, startDate: any) {
    $event.stopPropagation()

    this.appointmentService.getPatientPreviousVisits(patientId, startDate)
      .then(admissions => {
        this.patientPreviousAdmissions = admissions;
        this.isAdmissionPopupVisible = true;
      })
  }

  onAppointmentDeleting($event) {
    $event.cancel = true;
  }

  navigateToPatientChartFromScheduler($event, appointment) {
    $event.stopPropagation();
    this.router.navigate(["/patient-chart", appointment.id]);
  }

  navigateToPatientChart($event) {
    let selectedAppointemnt = $event.selectedRowsData[0];
    if (!selectedAppointemnt)
      return;

    this.router.navigate(["/patient-chart", selectedAppointemnt.id]);
  }

  onAppointmentFormOpening(data) {
    const form = data.form;

    this.currentOpenedAppointmentForm = form;

    var popup = data.component.getAppointmentPopup();
    this.setupAppointmentPopup(popup);

    //do not show validation summary during appointment creation
    form._options.showValidationSummary = false;

    const appointmentLocationId =
      data.appointmentData.locationId;

    //If we open already created appointment we have to set selected location id 
    //to avoid rooms that are not related to location do not appear in room select box
    if (appointmentLocationId)
      this.selectedLocationId = appointmentLocationId;

    form._options.colCount = 1

    form.option("items", [
      {
        itemType: "tabbed",
        tabPanelOptions: {
          deferRendering: false
        },
        tabs: [{
          colCount: 2,
          title: "Schedule Info",
          items: [
            this.initAppointmentPatientSelectBox(form),
            this.initAppointmentLocationSelectBox(form),
            this.initAppointmentRoomSelectBox(),
            this.initAppointmentPhysicianSelectBox(),
            this.initAppointmentNurseSelectBox(),
            this.initAppointmentStatusSelectBox(),
            this.initAppointmentStartDateBox(),
            this.initAppointmentEndDateBox(),
          ]
        },
        {
          title: "Notes",
          items: [
            this.initAllegationsTextArea(),
            this.initAllegationsNotesTextArea(),
            this.initManageAllegationsButton(),
          ]
        },
        {
          title: "Patient Chart",
          items: [
            this.initPatientChartDocumentSelectBox(form),
            this.initAdmissionTextBox()
          ]
        }]
      }
    ]);

    this.isAppointmentCreationFormOpened = true;
  }

  onAppointmentDeleted() {
    this.refreshRelatedSchedulerComponents();
  }

  onAppointmentAdded() {
    this.refreshRelatedSchedulerComponents();
  }

  onAppointmentUpdated() {
    this.refreshRelatedSchedulerComponents();
  }

  deleteAppointment($event, appointment: any) {
    $event.stopPropagation();

    const isAdmissionCreated = !!appointment.admissionId;
    if (isAdmissionCreated) {
      this.alertService.warning("The patient admission was already created. You cannot delete scheduled appointment.")
      return;
    }

    const appointmentId = appointment.id;

    this.alertService.confirm("Are you sure you want to delete the appointment?", "Confirm deletion")
      .then(deleteConfirmation => {
        if (deleteConfirmation) {
          this.appointmentService
            .delete(appointmentId)
            .then(() => {
              this.appointmentsGrid.instance.refresh();

              this.appointmentScheduler
                .instance.getDataSource().reload();

              this.hideSchedulerTooltip(null);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
        }
      });
  }

  hideSchedulerTooltip($event): void {
    if ($event)
      $event.stopPropagation();

    this.appointmentScheduler
      .instance.hideAppointmentTooltip();
  }

  ngOnInit() {
    this.initLocationDataSource();
    this.initPatientDataSource();
    this.initAppointmentGridDataSource();
    this.initAppointmentDataSource();
    this.initRoomDataSource();
    this.initNurseDataSource();
    this.initPhysicianDataSource();
    this.initPatientChartDocumentDataSource();

    this.subscribeToCompanyIdChanges();
  }

  ngOnDestroy(): void {
    this.companyIdSubscription.unsubscribe();
  }

  onFilterChanged(filter: any) {
    this.filter = filter;
    this.refreshSchedulerAndAppointmentsGrid();
  }

  onManageAllegationsBtnClick = () => {
    this.isManageAllegationsPopupVisible = true;
  }

  private refreshRelatedSchedulerComponents() {
    if (this.appointmentsGrid) {
      this.appointmentsGrid.instance.refresh();
    }
  }

  private initAdmissionTextBox() {
    return {
      label: {
        visible: false
      },
      editorType: "dxTextBox",
      dataField: "admissionId",
      editorOptions: {
        visible: false
      }
    }
  }

  private initAppointmentPatientSelectBox(form: any): any {
    return {
      label: {
        text: "Patient"
      },
      editorType: "dxSelectBox",
      dataField: "patientId",
      isRequired: true,
      editorOptions: {
        searchEnabled: true,
        dataSource: this.patientDataSource,
        displayExpr: "name",
        valueExpr: "id"
      }
    }
  }

  private initAppointmentLocationSelectBox(form: any): any {
    return {
      label: {
        text: "Location"
      },
      isRequired: true,
      editorType: "dxSelectBox",
      dataField: "locationId",
      editorOptions: {
        searchEnabled: true,
        dataSource: this.locationDataSource,
        displayExpr: "name",
        valueExpr: "id",
        onValueChanged: (args) => {
          if (!this.isAppointmentCreationFormOpened)
            return;

          const locationId = args.value;
          if (locationId) {
            this.selectedLocationId = locationId;

            const selectedRoomId = form.option("formData.roomId");
            if (selectedRoomId)
              form.option("formData.roomId", "");

            form.getEditor("roomId").getDataSource().reload();
          }
        }
      }
    }
  }

  private initPatientChartDocumentSelectBox(form: any): any {
    const isAdmissionAlreadyCreated =
      !!form.option("formData.admissionId");

    return {
      label: {
        text: isAdmissionAlreadyCreated
          ? "Unable to select patient chart document the admission was already created"
          : "The selected document will be used during building patient chart tree. If not selected, all company documents will be contained in the patient chart tree."
      },
      isRequired: false,
      dataField: "patientChartDocumentId",
      editorType: "dxSelectBox",
      editorOptions: {
        readOnly: isAdmissionAlreadyCreated,
        placeholder: "Select patient chart document...",
        showClearButton: true,
        searchEnabled: true,
        displayExpr: "name",
        valueExpr: "id",
        dataSource: this.patientChartDocumentDataSource
      }
    }
  }

  private initAppointmentRoomSelectBox(): any {
    return {
      label: {
        text: "Room"
      },
      isRequired: true,
      dataField: "roomId",
      editorType: "dxSelectBox",
      editorOptions: {
        searchEnabled: true,
        displayExpr: "name",
        valueExpr: "id",
        dataSource: this.roomDataSource
      }
    }
  }

  private initAppointmentPhysicianSelectBox(): any {
    return {
      label: {
        text: "Physician"
      },
      editorType: "dxSelectBox",
      dataField: "physicianId",
      isRequired: true,
      editorOptions: {
        displayExpr: "name",
        valueExpr: "id",
        searchEnabled: true,
        dataSource: this.physianDataSource
      }
    }
  }

  private initAppointmentNurseSelectBox(): any {
    return {
      label: {
        text: "Nurse"
      },
      isRequired: true,
      editorType: "dxSelectBox",
      dataField: "nurseId",
      editorOptions: {
        searchEnabled: true,
        dataSource: this.nurseDataSource,
        displayExpr: "name",
        valueExpr: "id"
      }
    }
  }

  private initAppointmentStatusSelectBox(): any {
    return {
      label: {
        text: "Status"
      },
      isRequired: true,
      dataField: "appointmentStatus",
      editorType: "dxSelectBox",
      editorOptions: {
        items: this.selectableListService
          .getSelectableListValuesFromComponent(this, SelectableListsNames.application.appointmentStatus)
      }
    }
  }

  private initAppointmentStartDateBox(): any {
    return {
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
    }
  }

  private initAppointmentEndDateBox(): any {
    return {
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
    }
  }

  private initManageAllegationsButton(): any {
    return {
      editorType: "dxButton",
      editorOptions: {
        stylingMode: "outlined",
        type: "default",
        text: "Manage Allegations",
        onClick: this.onManageAllegationsBtnClick
      }
    }
  }

  private initAllegationsTextArea(): any {
    return {
      label: {
        text: "Allegations"
      },
      editorType: "dxTextArea",
      dataField: "allegations",
      editorOptions: {
        dataField: "allegations",
        height: 100,
        onValueChanged: (args) => {
          this.allegationsString = args.value;
        }
      }
    }
  }

  private initAllegationsNotesTextArea(): any {
    return {
      label: {
        text: "Notes"
      },
      editorType: "dxTextArea",
      dataField: "allegationsNotes",
      editorOptions: {
        dataField: "allegationsNotes",
        height: 100
      }
    }
  }

  private initAppointmentGridDataSource() {
    const appointmentGridStore = createStore({
      loadUrl: this.dxDataUrlService.getGridUrl("appointment/griditem"),
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod(this.onBeforeRequestingAppointmentGridItems, this)
    });

    this.applyDecoratorForAppointmentGridDataSourceLoadFunc(appointmentGridStore)
    this.appointmentGridDataSource.store = appointmentGridStore;
  }

  private onBeforeRequestingAppointmentGridItems(method: string, ajaxOptions: any): void {
    if (method === "load") {
      ajaxOptions.data.startDate = DateHelper
        .jsLocalDateToSqlServerUtc(this.startDate);

      ajaxOptions.data.endDate = DateHelper
        .jsLocalDateToSqlServerUtc(this.endDate);

      ajaxOptions.data.companyId = this.companyId;

      this.applyFilterIfNeeded(ajaxOptions.data);
    }
  }

  private initAppointmentDataSource(): any {
    const appointmentStore = createStore({
      key: "id",
      loadUrl: this.dxDataUrlService.getGridUrl("appointment"),
      insertUrl: this.dxDataUrlService.getEntityEndpointUrl("appointment"),
      updateUrl: this.dxDataUrlService.getEntityEndpointUrl("appointment"),
      deleteUrl: this.dxDataUrlService.getEntityEndpointUrl("appointment"),
      updateMethod: "POST",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod(this.onBeforeRequestingAppointments, this)
    });

    this.appointmentDataSource.store = appointmentStore;
    this.applyDecoratorForDataSourceLoadFunc(appointmentStore)
  }

  private onBeforeRequestingAppointments(method: string, ajaxOptions: any): void {
    if (method === "delete") {
      ajaxOptions.url = `${ajaxOptions.url}/${ajaxOptions.data.key}`;
    }

    if (method === "load") {
      ajaxOptions.data.startDate = DateHelper.jsLocalDateToSqlServerUtc(this.startDate);
      ajaxOptions.data.endDate = DateHelper.jsLocalDateToSqlServerUtc(this.endDate);
      ajaxOptions.data.companyId = this.companyId;

      this.applyFilterIfNeeded(ajaxOptions.data);
    }
    if (method !== "load" && method !== "delete") {
      const appointmentData = JSON.parse(ajaxOptions.data["values"]);

      appointmentData.companyId = this.companyId;

      appointmentData.startDate = DateHelper.jsLocalDateToSqlServerUtc(appointmentData.startDate);
      appointmentData.endDate = DateHelper.jsLocalDateToSqlServerUtc(appointmentData.endDate);

      ajaxOptions.data = JSON.stringify(appointmentData);
      ajaxOptions.headers = {
        "Content-type": "application/json"
      };
    }
  }

  private applyFilterIfNeeded(parameters: any) {
    const locationId = this.filter.location;
    if (locationId)
      parameters.locationId = locationId;

    const patientId = this.filter.patient;
    if (patientId)
      parameters.patientId = patientId;

    const physicianId = this.filter.physician;
    if (physicianId)
      parameters.physicianId = physicianId;
  }

  private applyDecoratorForDataSourceLoadFunc(store: any) {
    const nativeLoadFunc = store.load;
    store.load = loadOptions => {
      this.startDate = loadOptions.dxScheduler.startDate;
      this.endDate = loadOptions.dxScheduler.endDate;

      return nativeLoadFunc.call(store, loadOptions)
        .then(result => {
          if (this.appointmentsGrid && this.appointmentsGrid.instance && this.appointmentsGrid.instance.refresh)
            this.appointmentsGrid.instance.refresh();

          result.forEach(item => {
            item.startDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.startDate);
            item.endDate = DateHelper.sqlServerUtcDateToLocalJsDate(item.endDate);
            item.date = DateHelper.sqlServerUtcDateToLocalJsDate(item.date);
          });
          return result;
        });
    };
  }

  private applyDecoratorForAppointmentGridDataSourceLoadFunc(store: any) {
    const nativeLoadFunc = store.load;
    store.load = loadOptions => {
      return nativeLoadFunc.call(store, loadOptions)
        .then(result => {
          result.forEach(appointmentGridItem => {
            appointmentGridItem.startDate = DateHelper
              .sqlServerUtcDateToLocalJsDate(appointmentGridItem.startDate);

            appointmentGridItem.endDate = DateHelper
              .sqlServerUtcDateToLocalJsDate(appointmentGridItem.endDate);
          });
          return result;
        });
    };
  }

  private initLocationDataSource(): void {
    this.locationDataSource.store = createStore({
      loadUrl: this.dxDataUrlService.getLookupUrl("location"),
      key: "id",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
          jQueryAjaxSettings.data.companyId = this.companyId;
        }, this)
    });
  }

  private initRoomDataSource(): void {
    this.roomDataSource.store = createStore({
      loadUrl: this.dxDataUrlService.getLookupUrl("room"),
      key: "id",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
          jQueryAjaxSettings.data.locationId = this.selectedLocationId;
          jQueryAjaxSettings.data.companyId = this.companyId;
        }, this)
    });
  }

  private initPatientDataSource(): void {
    this.patientDataSource.store = createStore({
      loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.patient),
      key: "id",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
          jQueryAjaxSettings.data.companyId = this.companyId;
        }, this)
    });
  }

  private initPhysicianDataSource(): void {
    this.physianDataSource.store = createStore({
      loadUrl: this.dxDataUrlService.getLookupUrl("user"),
      loadParams: { employeeType: EmployeeTypeList.values[0].value },
      key: "id",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
          jQueryAjaxSettings.data.companyId = this.companyId;
        }, this)
    });
  }

  private initNurseDataSource(): void {
    this.nurseDataSource.store = createStore({
      loadUrl: this.dxDataUrlService.getLookupUrl("user"),
      loadParams: { employeeType: EmployeeTypeList.values[1].value },
      key: "id",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
          jQueryAjaxSettings.data.companyId = this.companyId;
        }, this)
    });
  }

  private initPatientChartDocumentDataSource(): void {
    this.patientChartDocumentDataSource.store = createStore({
      loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.patientChartDocuments),
      key: "id",
      onBeforeSend: this.devextremeAuthService
        .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
          jQueryAjaxSettings.data.companyId = this.companyId;
        }, this)
    });
  }

  private refreshSchedulerAndAppointmentsGrid(): void {
    const appointmentScheduler = this.appointmentScheduler;
    if (appointmentScheduler && this.appointmentScheduler.instance)
      appointmentScheduler.instance.getDataSource().reload()

    const appointmentsGrid = this.appointmentsGrid;
    if (appointmentsGrid && appointmentsGrid.instance)
      appointmentsGrid.instance.refresh();
  }

  private setupAppointmentPopup(popup: any) {
    popup.option("width", 600);
    popup.option("height", 610);
    popup.option("onHidden", () => { this.currentOpenedAppointmentForm = null; })
    popup.option("title", "Schedule Appointment");

    popup.on("hidden", () => this.isAppointmentCreationFormOpened = false);
  }

  private subscribeToCompanyIdChanges() {
    this.companyIdSubscription = this.companyIdService.companyId
      .subscribe(companyId => {
        if (companyId) {
          this.companyId = companyId;

          this.initSelectableLists(this.companyId);

          this.refreshSchedulerAndAppointmentsGrid();
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  private initSelectableLists(companyId: string): void {
    if (this.areSelectableListsInitialized)
      this.areSelectableListsInitialized = false;

    const appointmentStatusListConfig =
      new SelectableListConfig(companyId,
        SelectableListsNames.application.appointmentStatus,
        LibrarySelectableListIds.application.appointmentStatus);

    this.selectableListService
      .setSelectableListsValuesToComponent([appointmentStatusListConfig], this)
      .then(() => {
        this.areSelectableListsInitialized = true;
      })
      .catch(error => this.alertService.error(error.message ? error.message : error));
  }
}