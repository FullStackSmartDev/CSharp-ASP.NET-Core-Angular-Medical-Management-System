import { NgModule } from '@angular/core';
import { PatientChartManagementComponent } from './patient-chart-management.component';
import { SectionNodeFormComponent } from './section-node-form/section-node-form.component';
import { TemplateNodeFormComponent } from './template-node-form/template-node-form.component';
import { TemplateListNodeFormComponent } from './template-list-node-form/template-list-node-form.component';
import { DocumentNodeFormComponent } from './document-node-form/document-node-form.component';
import { PatientChartContextMenuService } from '../../services/patient-chart-context-menu.service';
import { PatientChartNodeManagementService } from 'src/app/patientChart/services/patient-chart-node-management.service';
import { DxTreeViewModule, DxContextMenuModule, DxPopupModule, DxFormModule, DxSwitchModule, DxListModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/share/share.module';
import { ChangeNodeTitleFormComponent } from './change-node-title-form/change-node-title-form.component';

@NgModule({
    imports: [
        DxTreeViewModule,
        DxContextMenuModule,
        DxPopupModule,
        DxFormModule,
        DxSwitchModule,
        DxListModule,
        CommonModule,
        ShareModule
    ],
    declarations: [
        PatientChartManagementComponent,
        SectionNodeFormComponent,
        TemplateNodeFormComponent,
        TemplateListNodeFormComponent,
        DocumentNodeFormComponent,
        ChangeNodeTitleFormComponent
    ],
    exports: [
        PatientChartManagementComponent,
        SectionNodeFormComponent,
        TemplateNodeFormComponent,
        TemplateListNodeFormComponent,
        DocumentNodeFormComponent,
        ChangeNodeTitleFormComponent
    ],
    providers: [
        PatientChartContextMenuService,
        PatientChartNodeManagementService
    ]
})
export class PatientChartManagementModule { }