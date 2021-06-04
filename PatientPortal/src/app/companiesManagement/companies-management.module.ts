import { NgModule } from '@angular/core';
import { CompaniesManagementComponent } from './components/companies-management/companies-management.component';
import { DxDataGridModule, DxPopupModule, DxScrollViewModule, DxFormModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    imports: [
        CommonModule,
        DxDataGridModule,
        DxPopupModule,
        DxScrollViewModule,
        DxFormModule,
        NgxMaskModule
    ],
    declarations: [
        CompaniesManagementComponent
    ],
    providers: []
})
export class CompaniesManagementModule { }