import { Compiler, Component, ComponentFactory, NgModule, ModuleWithComponentFactories, Directive, ViewContainerRef, ComponentRef, Input, ReflectiveInjector } from '@angular/core';
import { PatientChartSectionInfo } from '../models/patientChartSectionInfo';
import { PatientChartTreeModule } from '../patient-chart-tree/patient-chart-tree.module';

export function createComponentFactory(compiler: Compiler, metadata: Component,
    templateViewModel: any, patientChartSection: any,
    patientChartTree: any, patientId: string, admissionId: string,
    isSignedOff: boolean, appointmentId: string, companyId: string): Promise<ComponentFactory<any>> {

    const cmpClass = class DynamicComponent {
        patientChartSectionValue: any;
        patientChartSection: any;
        patientChartTree: any;
        patientId: string = "";
        admissionId: string = "";
        appointmentId: string = "";
        companyId: string = "";
        isSignedOff: boolean = false;

        constructor() {
            this.patientChartSection = patientChartSection;
            this.patientChartTree = patientChartTree;

            this.patientChartSectionValue = patientChartSection.value;

            this.prepareTemplateViewModel(templateViewModel);

            this.patientId = patientId;
            this.admissionId = admissionId;
            this.appointmentId = appointmentId;
            this.companyId = companyId;
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
                PatientChartTreeModule
            ],
            declarations: [
                decoratedCmp,
            ],
            providers: []
        })
    class DynamicHtmlModule { }

    return compiler.compileModuleAndAllComponentsAsync(DynamicHtmlModule)
        .then((moduleWithComponentFactory: ModuleWithComponentFactories<any>) => {
            return moduleWithComponentFactory.componentFactories.find(x => x.componentType === decoratedCmp);
        });
}

@Directive({ selector: 'html-outlet' })
export class HtmlOutletDirective {
    @Input() patientChartSectionInfo: PatientChartSectionInfo;

    cmpRef: ComponentRef<any>;

    constructor(private vcRef: ViewContainerRef,
        private compiler: Compiler) { }

    ngOnChanges() {
        if (!this.patientChartSectionInfo)
            return;

        const patientChartSection = this.patientChartSectionInfo.patientChartSection;
        const patientChartTree = this.patientChartSectionInfo.patientChartTree;

        const patientId = this.patientChartSectionInfo.patientId;
        const admissionId = this.patientChartSectionInfo.admissionId;

        if (!patientChartSection || !patientChartTree || !patientId)
            return;

        const templateViewModel = patientChartSection.templateViewModel
            ? patientChartSection.templateViewModel
            : {};

        const template = patientChartSection.template
            ? patientChartSection.template
            : "<h5>No data to view</h5>";

        const companyId = this.patientChartSectionInfo.companyId;

        this.createDynamicComponent(template, templateViewModel, patientChartSection,
            patientChartTree, patientId, admissionId, this.patientChartSectionInfo.isSignedOff,
            this.patientChartSectionInfo.appointmentId, companyId);
    }

    private createDynamicComponent(template: string, templateViewModel: any,
        patientAdmissionSection: any, patientAdmission: any,
        patientId: string, admissionId: string, isSignedOff: boolean,
        appointmentId: string, companyId: string) {
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
            appointmentId,
            companyId
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