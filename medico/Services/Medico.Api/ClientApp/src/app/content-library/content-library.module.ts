import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagementComponent } from './components/content-management.component';
import { DxTreeViewModule, DxDataGridModule, DxFormModule, DxCheckBoxModule, DxPopupModule, DxSelectBoxModule, DxListModule, DxTabsModule, DxTextAreaModule } from 'devextreme-angular';
import { LibraryTemplateComponent } from './components/library-template/library-template.component';
import { ShareModule } from '../share/share.module';
import { LibraryTemplateTypeComponent } from './components/library-template-type/library-template-type.component';
import { LibrarySelectableListCategoryComponent } from './components/library-selectable-list-category/library-selectable-list-category.component';
import { LibrarySelectableListComponent } from './components/library-selectable-list/library-selectable-list.component';
import { LibraryPatientChartDocumentComponent } from './components/library-patient-chart-document/library-patient-chart-document.component';
import { PatientChartManagementModule } from '../administration/components/patientChartManagement/patient-chart-management.module';
import { LibraryExpressionsComponent } from './components/library-expressions/library-expressions.component';
import { LibraryReferenceTableComponent } from './components/library-expressions/library-reference-table/library-reference-table.component';
import { LibraryExpressionsBuilderComponent } from './components/library-expressions/library-expressions-builder/library-expressions-builder.component';

@NgModule({
    imports: [
        CommonModule,
        ShareModule,
        DxTreeViewModule,
        DxDataGridModule,
        DxFormModule,
        DxCheckBoxModule,
        DxPopupModule,
        DxSelectBoxModule,
        DxListModule,
        DxTabsModule,
        DxTextAreaModule,
        PatientChartManagementModule
    ],
    declarations: [
        ContentManagementComponent,
        LibraryTemplateComponent,
        LibraryTemplateTypeComponent,
        LibrarySelectableListCategoryComponent,
        LibrarySelectableListComponent,
        LibraryPatientChartDocumentComponent,
        LibraryExpressionsComponent,
        LibraryReferenceTableComponent,
        LibraryExpressionsBuilderComponent
    ],
    providers: []
})
export class ContentLibraryModule { }