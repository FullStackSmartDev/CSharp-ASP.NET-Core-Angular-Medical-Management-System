import { NgModule } from '@angular/core';
import { AppointmentSchedulerComponent } from './components/appointment-scheduler/appointment-scheduler.component';
import { AppointmentsFilterComponent } from './components/appointments-filter/appointments-filter.component';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxSchedulerModule } from 'devextreme-angular/ui/scheduler';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxListModule } from 'devextreme-angular/ui/list';
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