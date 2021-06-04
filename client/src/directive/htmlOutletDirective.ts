import {
    Component,
    Directive,
    NgModule,
    Input,
    ViewContainerRef,
    Compiler,
    ComponentFactory,
    ModuleWithComponentFactories,
    ComponentRef,
    ReflectiveInjector
} from '@angular/core';

import { HttpModule, Http } from '@angular/http';
import { IonicModule } from 'ionic-angular';

import {
    DxSchedulerModule,
    DxListModule,
    DxTreeViewModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxDropDownBoxModule,
    DxAutocompleteModule,
    DxLookupModule,
    DxGalleryModule,
    DxMultiViewModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxScrollViewModule,
    DxNumberBoxModule,
    DxCheckBoxModule
} from 'devextreme-angular'
import { DataService } from '../provider/dataService';
import { SharedModule } from '../app/shared.module';
import { PatientDataModelTrackService } from '../provider/patientDataModelTrackService';
import { LookupDataSourceProvider } from '../provider/lookupDataSourceProvider';
import { SelectableItemHtmlService } from '../provider/selectableItemHtmlService';
import { TemplateLookupItemValidationDataService } from '../provider/dataServices/read/templateLookupItemValidationDataService';
import { TemplateLookupItemDataService, TobaccoHistoryDataService, DrugHistoryDataService } from '../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { SyncService } from '../provider/syncService';
import { TemplateLookupItemTable, TobaccoHistoryTable, DrugHistoryTable } from '../provider/sqlDataSource/table/tables';
import { SelectSqlStringProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/selectSqlStringProvider';
import { UpdateSqlStringProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/updateSqlStringProvider';
import { InsertSqlStringProvider } from '../provider/sqlDataSource/sqlQueryStringProviders/insertSqlStringProvider';
import { AlertService } from '../provider/alertService';
import { LoadPanelService } from '../provider/loadPanelService';
import { ToastService } from '../provider/toastService';


export function createComponentFactory(compiler: Compiler, metadata: Component,
    templateViewModel: any, patientAdmissionSection: any,
    patientAdmission: any, patientId: string, admissionId: string,
    isSignedOff: boolean, appointmentId: string): Promise<ComponentFactory<any>> {

    const cmpClass = class DynamicComponent {
        nodeData: any;
        patientAdmissionSection: any;
        patientAdmission: any;
        patientId: string = "";
        admissionId: string = "";
        appointmentId: string = "";
        isSignedOff: boolean = false;

        constructor() {
            this.patientAdmissionSection =
                patientAdmissionSection;

            this.patientAdmission = patientAdmission;

            this.nodeData = patientAdmissionSection.value;

            this.prepareTemplateViewModel(templateViewModel);

            this.patientId = patientId;
            this.admissionId = admissionId;
            this.appointmentId = appointmentId;
            this.isSignedOff = isSignedOff;
        }

        prepareTemplateViewModel(viewModel: any) {
            if (!viewModel)
                return;

            for (const viewModelPropName in viewModel) {
                if (viewModel.hasOwnProperty(viewModelPropName)) {
                    let viewModelPropValue = viewModel[viewModelPropName];
                    if (typeof (viewModelPropValue) === "string") {

                        let func = this.parseFunctionFromString(viewModelPropValue);
                        if (func && typeof (func) === "function")
                            this[viewModelPropName] = func;
                        else
                            this[viewModelPropName] = viewModelPropValue;

                        continue;
                    }
                    this[viewModelPropName] = viewModelPropValue;
                }
            }
        }

        parseFunctionFromString(str): Function {
            //need more complex check because string value can contains '{' braces for example '{test'
            let fn_body_idx = str.indexOf('{');
            if (fn_body_idx === -1)
                return;
            let fn_body = str.substring(fn_body_idx + 1, str.lastIndexOf('}')),
                fn_declare = str.substring(0, fn_body_idx),
                fn_params = fn_declare.substring(fn_declare.indexOf('(') + 1, fn_declare.lastIndexOf(')')),
                args = fn_params.split(',');

            args.push(fn_body);

            function Fn() {
                return Function.apply(this, args);
            }
            Fn.prototype = Function.prototype;

            return Fn();
        }
    };

    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule
        ({
            imports: [
                SharedModule,
                DxSchedulerModule,
                DxListModule,
                DxTreeViewModule,
                DxDataGridModule,
                DxButtonModule,
                DxTextBoxModule,
                DxDateBoxModule,
                DxDropDownBoxModule,
                DxAutocompleteModule,
                IonicModule,
                HttpModule,
                DxLookupModule,
                DxGalleryModule,
                DxMultiViewModule,
                DxPopupModule,
                DxSelectBoxModule,
                DxTextAreaModule,
                DxScrollViewModule,
                DxNumberBoxModule,
                DxCheckBoxModule],
            declarations:
                [decoratedCmp],
            providers:
                [
                    DrugHistoryDataService,
                    DrugHistoryTable,
                    TobaccoHistoryDataService,
                    InsertSqlStringProvider,
                    UpdateSqlStringProvider,
                    SelectSqlStringProvider,
                    TemplateLookupItemTable,
                    SyncService,
                    TemplateLookupItemDataService,
                    TemplateLookupItemValidationDataService,
                    DataService,
                    SelectableItemHtmlService,
                    LookupDataSourceProvider,
                    PatientDataModelTrackService,
                    AlertService,
                    ToastService,
                    LoadPanelService,
                    TobaccoHistoryTable
                ]
        })
    class DynamicHtmlModule { }

    return compiler.compileModuleAndAllComponentsAsync(DynamicHtmlModule)
        .then((moduleWithComponentFactory: ModuleWithComponentFactories<any>) => {
            return moduleWithComponentFactory.componentFactories.find(x => x.componentType === decoratedCmp);
        });
}

@Directive({ selector: 'html-outlet' })
export class HtmlOutlet {
    @Input() patientAdmissionSectionModel: PatientAdmissionSectionModel;

    cmpRef: ComponentRef<any>;

    constructor(private vcRef: ViewContainerRef,
        private compiler: Compiler, private http: Http) { }

    ngOnChanges() {
        if (!this.patientAdmissionSectionModel)
            return;

        const patientAdmissionSection =
            this.patientAdmissionSectionModel.currentPatientAdmissionSection;

        const patientAdmissionModel =
            this.patientAdmissionSectionModel.patientAdmissionModel;

        const patientId = this.patientAdmissionSectionModel.patientId;
        const admissionId = this.patientAdmissionSectionModel.admissionId;

        if (!patientAdmissionSection || !patientAdmissionModel || !patientId)
            return;

        const templateViewModel = patientAdmissionSection.templateViewModel
            ? patientAdmissionSection.templateViewModel
            : {};

        const template = patientAdmissionSection.template
            ? patientAdmissionSection.template
            : "<h5>No data to view</h5>";

        this.createDynamicComponent(template, templateViewModel, patientAdmissionSection,
            patientAdmissionModel, patientId, admissionId, this.patientAdmissionSectionModel.isSignedOff,
            this.patientAdmissionSectionModel.appointmentId);
    }

    private createDynamicComponent(template: string, templateViewModel: any,
        patientAdmissionSection: any, patientAdmission: any,
        patientId: string, admissionId: string, isSignedOff: boolean,
        appointmentId: string) {
        if (!template)
            return;

        if (this.cmpRef) {
            this.cmpRef.destroy();
        }

        const compMetadata = new Component({
            selector: 'dynamic-html',
            template: template
        });

        createComponentFactory(
            this.compiler,
            compMetadata,
            templateViewModel,
            patientAdmissionSection,
            patientAdmission,
            patientId,
            admissionId,
            isSignedOff,
            appointmentId
        )
            .then(factory => {
                const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
                this.cmpRef = this.vcRef.createComponent(factory, 0, injector, []);
            });
    }

    ngOnDestroy() {
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    }
}

export class PatientAdmissionSectionModel {

    constructor(patientAdmissionModel: any, currentPatientAdmissionSection: any,
        patientId: string, admissionId: string, isSignedOff: boolean, appointmentId: string) {
        this.patientAdmissionModel = patientAdmissionModel;
        this.currentPatientAdmissionSection = currentPatientAdmissionSection;
        this.patientId = patientId;
        this.admissionId = admissionId;
        this.isSignedOff = isSignedOff;
        this.appointmentId = appointmentId;
    }

    currentPatientAdmissionSection: any;
    patientAdmissionModel: any;
    patientId: string;
    admissionId: string;
    isSignedOff: boolean;
    appointmentId: string;
}