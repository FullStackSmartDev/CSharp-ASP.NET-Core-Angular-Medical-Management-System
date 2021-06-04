import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsManagementComponent } from './components/patients-management.component';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxTabPanelModule } from 'devextreme-angular/ui/tab-panel';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { NgxMaskModule } from 'ngx-mask';
import { ShareModule } from '../share/share.module';
import { PatientInsuranceService } from '../_services/patient-insurance.service';
import { PatientAppointmentsComponent } from './components/patient-appointments/patient-appointments.component';
import { DxTextAreaModule } from 'devextreme-angular';
import { PatientChartTreeModule } from '../patientChart/patient-chart-tree/patient-chart-tree.module';

@NgModule({
    imports: [
        CommonModule,
        DxPopupModule,
        DxFormModule,
        DxDataGridModule,
        NgxMaskModule.forRoot(),
        DxTabPanelModule,
        DxButtonModule,
        ShareModule,
        DxTextAreaModule,
        PatientChartTreeModule
    ],
    declarations: [
        PatientsManagementComponent,
        PatientAppointmentsComponent
    ],
    providers: [
        PatientInsuranceService
    ]
})
export class PatientsModule { }