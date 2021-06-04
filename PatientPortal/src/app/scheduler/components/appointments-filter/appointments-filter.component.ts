import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { AppointmentsFilter } from '../../models/appointmentsFilter';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { Subscription } from 'rxjs';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: 'appointments-filter',
    templateUrl: './appointments-filter.component.html'
})
export class AppointmentsFilterComponent implements OnInit, OnDestroy {
    @ViewChild("physicianSelectBox", { static: false }) physicianSelectBox: DxSelectBoxComponent;
    @ViewChild("locationSelectBox", { static: false }) locationSelectBox: DxSelectBoxComponent;
    @ViewChild("patientSelectBox", { static: false }) patientSelectBox: DxSelectBoxComponent;

    @Output() onFilterChanged = new EventEmitter<any>();

    private _startDate: any;
    private _endDate: any;

    get startDate(): any {
        return this._startDate;
    }

    get endDate(): any {
        return this._endDate;
    }

    @Input("startDate")
    set startDate(startDate: any) {
        this._startDate = startDate;
        if (this.startDate && this.endDate) {
            this.reloadLookups();
        }
    }

    @Input("endDate")
    set endDate(endDate: any) {
        this._endDate = endDate;
        if (this.startDate && this.endDate) {
            this.reloadLookups();
        }
    }

    physianDataSource: any = {};
    locationDataSource: any = {};
    patientDataSource: any = {};

    companyId: string = GuidHelper.emptyGuid;

    companyIdSubscription: Subscription;

    ngOnInit(): void {
        this.initPhysianDataSource();
        this.initLocationDataSource();
        this.initPatientDataSource();

        this.subscribeToCompanyIdChanges();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    filter: AppointmentsFilter = new AppointmentsFilter();

    constructor(private dxDataUrlService: DxDataUrlService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    filterChanged($event) {
        const newValue = $event.value;
        const previousValue = $event.previousValue;

        if (newValue != previousValue)
            this.onFilterChanged.next(this.filter);
    }

    private initLocationDataSource(): any {
        this.locationDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("location"),
            onBeforeSend: this.onBeforeSend(),
            key: "id"
        });
    }

    private initPatientDataSource(): any {
        this.patientDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("patient"),
            onBeforeSend: this.onBeforeSend(),
            key: "id"
        });
    }

    private initPhysianDataSource(): any {
        this.physianDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("user"),
            onBeforeSend: this.onBeforeSend(),
            key: "id"
        });
    }

    private onBeforeSend(): (method: string, ajaxOptions: any) => void {
        return this.devextremeAuthService
            .decorateOnBeforeSendMethod(this.onBeforeRequestingApi, this);
    }

    private onBeforeRequestingApi(method: string, ajaxOptions: any): void {
        ajaxOptions.data.startDate = DateHelper.jsLocalDateToSqlServerUtc(this.startDate);
        ajaxOptions.data.endDate = DateHelper.jsLocalDateToSqlServerUtc(this.endDate);
        ajaxOptions.data.companyId = this.companyId;
    }

    private reloadLookups(): any {
        const areLookupsReady = this.patientSelectBox
            && this.locationSelectBox && this.physicianSelectBox;

        if (!areLookupsReady) {
            return;
        }

        const areLookupInstancesReady = this.patientSelectBox.instance
            && this.locationSelectBox.instance && this.physicianSelectBox.instance;

        if (!areLookupInstancesReady) {
            return;
        }

        this.patientSelectBox.instance.getDataSource().reload();
        this.locationSelectBox.instance.getDataSource().reload();
        this.physicianSelectBox.instance.getDataSource().reload();
    }

    private resetFilter() {
        if (this.filter.location)
            this.filter.location = "";

        if (this.filter.patient)
            this.filter.patient = "";

        if (this.filter.physician)
            this.filter.physician = "";
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    this.resetFilter();
                    this.reloadLookups();
                }
            });
    }
}