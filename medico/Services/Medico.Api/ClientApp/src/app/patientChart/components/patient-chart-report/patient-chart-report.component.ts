import { Component, Input, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { DxTreeViewComponent } from "devextreme-angular";
import { ReportSectionService } from "../../services/report-section.service";
import { SignatureInfoService } from "../../services/signature-info.service";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from 'src/app/_services/config.service';
import { AlertService } from 'src/app/_services/alert.service';
import { saveAs } from 'file-saver';
import { PatientInsuranceService } from 'src/app/_services/patient-insurance.service';
import { PatientDataModelNode } from '../../classes/patientDataModelNode';
import { ReportDataTreeNode } from '../../classes/reportDataTreeNode';
import { ObjectHelper } from 'src/app/_helpers/object.helper';
import { PatientChartNodeReportInfo } from '../report-sections/baseHistoryReportSection';
import { Admission } from '../../models/admission';
import { PatientChartNodeManagementService } from '../../services/patient-chart-node-management.service';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { PatientChartReportHeaderService } from '../../services/patient-chart-report-header.service';
import { PatientChartReportFooterService } from '../../services/patient-chart-report-footer.service';

declare const tinymce: any;

@Component({
    templateUrl: "patient-chart-report.component.html",
    selector: "patient-chart-report"
})

export class PatientChartReportComponent implements OnInit, AfterViewInit {
    @Input() patientChartTreeView: PatientDataModelNode[] = [];
    @Input() admission: Admission;
    @Input() companyId: string;

    @ViewChild("patientChartTreeViewComponent", { static: false }) patientChartTreeViewComponent: DxTreeViewComponent;

    patientChart: PatientChartNode;

    reportDataTree: ReportDataTreeNode;

    reportEditorId: string = "report-editor";
    reportEditor: any;
    reportContent: string = "";

    reportUrl: string = "";

    constructor(private reportSectionService: ReportSectionService,
        private signatureInfoAppService: SignatureInfoService,
        private httpClient: HttpClient,
        private configService: ConfigService,
        private alertService: AlertService,
        private patientInsuranceService: PatientInsuranceService,
        private patientChartNodeManagementService: PatientChartNodeManagementService,
        private patientChartReportHeaderService: PatientChartReportHeaderService,
        private patientChartReportFooterService: PatientChartReportFooterService) {

        this.reportUrl = `${this.configService.apiUrl}report`;
    }

    generatePdfReport() {
        const reportBody = this.reportEditor.getBody();
        const reportContent = {
            reportContent: reportBody.innerHTML
        }

        this.httpClient.post(this.reportUrl, reportContent, { observe: 'response', responseType: 'blob' })
            .toPromise()
            .then((response) => {
                var blob = new Blob([response.body], { type: "application/pdf" });

                const patientId = this.admission.patientId;
                this.patientInsuranceService.getByPatientId(patientId)
                    .then(patientInsurance => {
                        if (!patientInsurance) {
                            saveAs(blob, 'report.pdf');
                            return;
                        }

                        const caseNumber = patientInsurance.caseNumber;
                        const reportName = caseNumber ? caseNumber : "report";

                        saveAs(blob, `${reportName}.pdf`);
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

    }

    ngOnInit() {
        this.patientChart = JSON.parse(this.admission.admissionData);
    }

    ngAfterViewInit() {
        this.initPatientChartTreeViewComponentDataSource();
        this.setUpReportEditor();
    }

    ngOnDestroy() {
        tinymce.remove(this.reportEditor);
    }

    patientChartSectionSelectionChanged($event) {
        const reportTreeNode = $event.itemData;
        const isSectionSelected = $event.node.selected;

        if (isSectionSelected)
            this.addPatientChartNodeReportContent(reportTreeNode.id);
        else
            this.removePatientChartNodeReportContent(reportTreeNode.id);
    }

    private initReportDataTree(isPatientAdmissionSignedOff: boolean) {
        const reportDataTreeRootNode = new ReportDataTreeNode();

        const headerHtmlPromise = this.getReportHeader();
        const footerHtmlPromise = this.getReportFooter(isPatientAdmissionSignedOff);

        Promise.all([headerHtmlPromise, footerHtmlPromise])
            .then(result => {
                const reportHeaderHtml = result[0];
                const reportFooterHtml = result[1];

                const reportDataTreeHeader =
                    new ReportDataTreeNode(GuidHelper.generateNewGuid(), reportHeaderHtml);

                const reportDataTreeBody = this.generateReportBody();

                reportDataTreeRootNode.childrenNodes
                    .push(reportDataTreeHeader);

                reportDataTreeRootNode.childrenNodes
                    .push(reportDataTreeBody);

                if (reportFooterHtml) {
                    const reportDataTreeFooter =
                        new ReportDataTreeNode("", reportFooterHtml);

                    reportDataTreeRootNode.childrenNodes
                        .push(reportDataTreeFooter);
                }

                this.reportDataTree = reportDataTreeRootNode;
                this.updateReportContent();
            });
    }

    private getReportHeader(): Promise<string> {
        return this.patientChartReportHeaderService
            .getPatientChartNodeReportContent(this.admission, this.companyId);
    }

    private getReportFooter(isPatientAdmissionSignedOff: boolean): Promise<string> {
        if (!isPatientAdmissionSignedOff)
            return Promise.resolve("");

        return this.patientChartReportFooterService
            .getPatientChartNodeReportContent(this.admission.id);
    }

    private generateReportBody(): ReportDataTreeNode {
        const patientChartTree = this.patientChartTreeViewComponent
            .dataSource[0];
        return this.convertPatientChartTreeNodeToReportDataTreeNode(patientChartTree);
    }

    private convertPatientChartTreeNodeToReportDataTreeNode(patientChartTreeNode: PatientDataModelNode)
        : ReportDataTreeNode {
        const reportDataTreeNode = new ReportDataTreeNode(patientChartTreeNode.id);

        const patientChartTreeNodeChildren = patientChartTreeNode.items;

        if (patientChartTreeNodeChildren && patientChartTreeNodeChildren.length) {
            for (let i = 0; i < patientChartTreeNodeChildren.length; i++) {
                const patientChartTreeChildNode = patientChartTreeNodeChildren[i];
                const childDataTreeNode =
                    this.convertPatientChartTreeNodeToReportDataTreeNode(patientChartTreeChildNode);

                reportDataTreeNode.childrenNodes.push(childDataTreeNode);
            }
        }

        return reportDataTreeNode;
    }

    private generateReportContent(content: string, reportDataTreeNode: ReportDataTreeNode): string {
        if (reportDataTreeNode.html) {
            content += reportDataTreeNode.html;
        }

        const childrenNodes = reportDataTreeNode.childrenNodes;

        if (childrenNodes.length) {
            for (let i = 0; i < childrenNodes.length; i++) {
                const childNode = childrenNodes[i];
                content = this.generateReportContent(content, childNode);
            }
        }

        return content;
    }

    private updateReportContent() {
        const reportContent = this.generateReportContent("", this.reportDataTree);
        this.reportContent = `<div style="width:100%;">${reportContent}</div>`;
        this.reportEditor.setContent(this.reportContent);
    }

    private removePatientChartNodeReportContent(reportDataTreeNodeId: string) {
        const reportDataTreeNode =
            this.getReportDataTreeNodeById(reportDataTreeNodeId, this.reportDataTree);

        this.removePatientChartReportNodesContent(reportDataTreeNode);
        this.updateReportContent();
    }

    private addPatientChartNodeReportContent(patientTreeNodeId: string) {
        const reportDataTreeNode =
            this.getReportDataTreeNodeById(patientTreeNodeId, this.reportDataTree);

        this.addPatientChartTreeReportContent(reportDataTreeNode)
            .then(() => {
                this.updateReportContent();
            });
    }

    private removePatientChartReportNodesContent(reportDataTreeNode: ReportDataTreeNode): void {
        reportDataTreeNode.html = "";

        const childrenNodes = reportDataTreeNode.childrenNodes;

        if (childrenNodes.length) {
            for (let i = 0; i < childrenNodes.length; i++) {
                const childNode = childrenNodes[i];

                this.removePatientChartReportNodesContent(childNode);
            }
        }
    }

    private addPatientChartTreeReportContent(reportDataTreeNode: ReportDataTreeNode): Promise<any> {
        const patientChartNode = this.patientChartNodeManagementService
            .getById(reportDataTreeNode.patientChartNodeId, this.patientChart);

        const patientChartNodeReportInfo =
            new PatientChartNodeReportInfo(this.admission.patientId,
                patientChartNode, this.admission.id, this.admission.appointmentId);

        return this.reportSectionService
            .getPatientChartNodeContent(patientChartNodeReportInfo)
            .then(htmlContent => {
                if (htmlContent)
                    reportDataTreeNode.html = htmlContent;

                const childrenNodes = reportDataTreeNode.childrenNodes;

                if (childrenNodes.length) {
                    const childrenNodesPromises: Promise<any>[] = []

                    for (let i = 0; i < childrenNodes.length; i++) {
                        const childNode = childrenNodes[i];
                        const childNodePromise =
                            this.addPatientChartTreeReportContent(childNode);

                        childrenNodesPromises.push(childNodePromise);
                    }

                    return Promise.all(childrenNodesPromises);
                }

                return Promise.resolve([]);
            });
    }

    private getReportDataTreeNodeById(reportDataTreeNodeId: string, reportDataTreeNode: ReportDataTreeNode): ReportDataTreeNode {
        if (reportDataTreeNodeId === reportDataTreeNode.patientChartNodeId)
            return reportDataTreeNode;

        const childrenNodes = reportDataTreeNode.childrenNodes;

        if (!childrenNodes.length)
            return null;


        for (let i = 0; i < childrenNodes.length; i++) {
            const childNode = childrenNodes[i];
            const childReportDataTreeNode = this.getReportDataTreeNodeById(reportDataTreeNodeId, childNode);

            if (childReportDataTreeNode)
                return childReportDataTreeNode;
        }

        return null;
    }

    private setUpReportEditor() {
        setTimeout(() => {
            tinymce.init({
                extended_valid_elements: "span[id|metadata]",
                content_css: `${this.configService.baseUrl}css/tinymce-extended-styles.css`,
                height: 520,
                selector: `#${this.reportEditorId}`,
                plugins: ["lists table"],
                menubar: false,
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
                setup: editor => {
                    this.reportEditor = editor;
                },
                init_instance_callback: (editor: any) => {
                    this.signatureInfoAppService.isAdmissionSignedOff(this.admission.id)
                        .then(isAdmissionSignedOff => {
                            if (isAdmissionSignedOff) {
                                this.reportEditor.setMode("readonly")
                            }

                            this.initReportDataTree(isAdmissionSignedOff);
                        });
                }
            });
        }, 0);
    }

    private initPatientChartTreeViewComponentDataSource() {
        const patientChartTreeViewCopy = ObjectHelper
            .copy(this.patientChartTreeView);

        this.patientChartTreeViewComponent.dataSource =
            [this.getPatientChartReportTreeViewNode(patientChartTreeViewCopy[0])];
    }

    //we have to remove all invisible nodes
    private getPatientChartReportTreeViewNode(patientChartNode: PatientDataModelNode)
        : PatientDataModelNode {

        const isVisible = patientChartNode.visible;
        const isNotShownInReport = patientChartNode.isNotShownInReport;
        if (isNotShownInReport || !isVisible)
            return null;

        const children = patientChartNode.items;
        if (!children || !children.length)
            return patientChartNode;

        this.removeInvisibleNodes(children);

        return patientChartNode;
    }

    private removeInvisibleNodes(patientChartNodes: PatientDataModelNode[]) {
        const patientChartNodesIndexesToRemove =
            patientChartNodes.reduce((indexesToRemove, patientChartNode, index) => {
                const patientChartReportTreeViewNode = this.getPatientChartReportTreeViewNode(patientChartNode);
                if (!patientChartReportTreeViewNode)
                    indexesToRemove.push(index);

                return indexesToRemove;
            }, []);

        if (!patientChartNodesIndexesToRemove.length)
            return;

        let numberOfDeletedNodes = 0;

        patientChartNodesIndexesToRemove.forEach(indexToRemove => {
            patientChartNodes.splice(indexToRemove - numberOfDeletedNodes, 1);
            numberOfDeletedNodes++;
        });
    }
}