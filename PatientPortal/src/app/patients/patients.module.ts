import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsManagementComponent } from './components/patients-management.component';
import { DxPopupModule, DxFormModule, DxDataGridModule, DxTabPanelModule, DxButtonModule } from 'devextreme-angular';
import { NgxMaskModule } from 'ngx-mask';
import { ShareModule } from '../share/share.module';
import { PatientInsuranceService } from '../_services/patient-insurance.service';

@NgModule({
    imports: [
        CommonModule,
        DxPopupModule,
        DxFormModule,
        DxDataGridModule,
        NgxMaskModule.forRoot(),
        DxTabPanelModule,
        DxButtonModule,
        ShareModule
    ],
    declarations: [PatientsManagementComponent],
    providers: [
        PatientInsuranceService
    ]
})
export class PatientsModule { }