import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaDatePipe, DatePipe, TimePipe, AgePipe } from './pipes/date.pipe';
import { PatientSelectableRootComponent } from './components/patient-selectable-root/patient-selectable-root.component';
import { PatientSelectableListComponent } from './components/patient-selectable-list/patient-selectable-list.component';
import { PatientSelectableRangeComponent } from './components/patient-selectable-range/patient-selectable-range.component';
import { PatientSelectableDateComponent } from './components/patient-selectable-date/patient-selectable-date.component';
import { DxPopupModule, DxListModule, DxTextAreaModule, DxButtonModule, DxNumberBoxModule, DxTextBoxModule, DxSelectBoxModule, DxFormModule } from 'devextreme-angular';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TemplateTypeMappingComponent } from './components/template-keyword-mapping-form/template-type-mapping/template-type-mapping.component';
import { KeywordMappingComponent } from './components/template-keyword-mapping-form/keyword-mapping/keyword-mapping.component';
import { TemplateKeywordMappingFormComponent } from './components/template-keyword-mapping-form/template-keyword-mapping-form.component';
import { NotSetPipe } from './pipes/not-set.pipe';
import { ValueComponent } from './components/value-component/value.component';
import { DebounceClickDirective } from './directives/debounce-click.directive';

@NgModule({
    imports: [
        CommonModule,
        DxPopupModule,
        DxListModule,
        DxTextAreaModule,
        DxButtonModule,
        DxNumberBoxModule,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxFormModule
    ],
    declarations: [
        PatientSelectableRootComponent,
        PatientSelectableListComponent,
        PatientSelectableRangeComponent,
        PatientSelectableDateComponent,
        LocaDatePipe,
        DatePipe,
        SafeHtmlPipe,
        TimePipe,
        AgePipe,
        NotSetPipe,
        TemplateTypeMappingComponent,
        KeywordMappingComponent,
        TemplateKeywordMappingFormComponent,
        ValueComponent,
        DebounceClickDirective
    ],
    exports: [
        AgePipe,
        TimePipe,
        DatePipe,
        LocaDatePipe,
        NotSetPipe,
        SafeHtmlPipe,
        PatientSelectableRootComponent,
        PatientSelectableListComponent,
        PatientSelectableRangeComponent,
        PatientSelectableDateComponent,
        TemplateKeywordMappingFormComponent,
        ValueComponent,
        DebounceClickDirective
    ]
})
export class ShareModule { }