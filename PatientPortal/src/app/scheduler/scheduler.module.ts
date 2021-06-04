import { NgModule } from '@angular/core';
import { AppointmentSchedulerComponent } from './components/appointment-scheduler/appointment-scheduler.component';
import { AppointmentsFilterComponent } from './components/appointments-filter/appointments-filter.component';
import { DxFormModule, DxSelectBoxModule, DxSchedulerModule, DxDataGridModule, DxPopupModule, DxScrollViewModule, DxListModule } from 'devextreme-angular';
import { AppointmentService } from '../_services/appointment.service';
import { PatientLastVisitComponent } from './components/patient-last-visit/patient-last-visit.component';
import { ShareModule } from '../share/share.module';
import { CommonModule } from "@angular/common"
import { AppointmentAllegationsComponent } from './components/appointment-allegations/appointment-allegations.component';

@NgModule({
    imports: [
        CommonModule,
        DxFormModule,
        DxSelectBoxModule,
        DxSchedulerModule,
        DxDataGridModule,
        ShareModule,
        DxPopupModule,
        DxScrollViewModule,
        DxListModule
    ],
    declarations: [
        AppointmentSchedulerComponent,
        AppointmentsFilterComponent,
        PatientLastVisitComponent,
        AppointmentAllegationsComponent
    ],
    providers: [
        AppointmentService
    ]
})
export class SchedulerModule { }