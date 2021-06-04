import { Compiler, Component, ComponentFactory, NgModule, ModuleWithComponentFactories, Directive, ViewContainerRef, ComponentRef, Input, ReflectiveInjector, CompilerFactory, COMPILER_OPTIONS } from '@angular/core';
import { PatientChartTreeModule } from '../patient-chart-tree/patient-chart-tree.module';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartInfo } from '../models/patientChartInfo';
import { PredefinedTemplateTypeNames } from 'src/app/_classes/predefinedTemplateTypeNames';

export function createComponentFactory(compiler: Compiler, metadata: Component,
    patientChartRootNode: PatientChartNode,
    patientChartNode: PatientChartNode,
    patientId: string,
    admissionId: string,
    isSignedOff: boolean,
    appointmentId: string,
    companyId: string): Promise<ComponentFactory<any>> {

    const cmpClass = class DynamicComponent {
        patientChartNode: PatientChartNode;
        patientChartDocumentNode: PatientChartNode;
        patientId: string;
        admissionId: string;
        appointmentId: string;
        companyId: string;
        isSignedOff: boolean;

        //predefined template types
        ros: string = PredefinedTemplateTypeNames.ros;

        constructor() {
            this.patientChartNode = patientChartNode;
            this.patientChartDocumentNode = patientChartRootNode;

            this.patientId = patientId;
            this.admissionId = admissionId;
            this.appointmentId = appointmentId;
            this.companyId = companyId;
            this.isSignedOff = isSignedOff;
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

@Directive({ selector: "html-outlet" })
export class HtmlOutletDirective {
    @Input() patientChartInfo: PatientChartInfo;

    cmpRef: ComponentRef<any>;

    constructor(private vcRef: ViewContainerRef,
        private compiler: Compiler) { }

    ngOnChanges() {
        if (!this.patientChartInfo)
            return;

        const patientChartDocumentNode =
            this.patientChartInfo.patientChartDocuemntNode;

        const patientChartNode =
            this.patientChartInfo.patientChartNode;

        const patientId = this.patientChartInfo.patientId;
        const admissionId = this.patientChartInfo.admissionId;

        if (!patientChartNode || !patientId)
            return;

        const patientChartNodeTemplate =
            patientChartNode.template;

        const reportNodeViewTemplate =
            `<report-node-view [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode'
                [patientChartDocumentNode]='patientChartDocumentNode' 
                [appointmentId]='appointmentId'
                [patientId]='patientId'
                [admissionId]='admissionId'
                [companyId]='companyId'>
             </report-node-view>`;

        const template = patientChartNodeTemplate
            ? patientChartNodeTemplate
            : reportNodeViewTemplate;

        const companyId = this.patientChartInfo.companyId;

        this.createDynamicComponent(template, patientChartDocumentNode,
            patientChartNode, patientId, admissionId, this.patientChartInfo.isSignedOff,
            this.patientChartInfo.appointmentId, companyId);
    }

    private createDynamicComponent(template: string,
        patientChartDocumentNode: PatientChartNode, patientChartNode: PatientChartNode,
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
            patientChartDocumentNode,
            patientChartNode,
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