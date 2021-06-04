import { Component, Input, OnInit } from "@angular/core";
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import { PatientChartNodeReportInfo } from 'src/app/patientChart/components/report-sections/baseHistoryReportSection';
import { ReportSectionService } from 'src/app/patientChart/services/report-section.service';
import { ReportDataTreeNode } from 'src/app/patientChart/classes/reportDataTreeNode';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { PatientChartReportHeaderService } from 'src/app/patientChart/services/patient-chart-report-header.service';
import { PatientChartReportFooterService } from 'src/app/patientChart/services/patient-chart-report-footer.service';
import { Admission } from 'src/app/patientChart/models/admission';

@Component({
    templateUrl: "report-node-view.component.html",
    selector: "report-node-view"
})
export class ReportNodeViewComponent implements OnInit {
    @Input() patientChartNode: PatientChartNode;
    @Input() patientChartDocumentNode: PatientChartNode;
    @Input() admissionId: string;
    @Input() appointmentId: string;
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    reportNodeContent: string = "";

    constructor(private reportSectionService: ReportSectionService,
        private patientChartReportHeaderService: PatientChartReportHeaderService,
        private patientChartReportFooterService: PatientChartReportFooterService) {
    }

    ngOnInit(): void {
        const isRootNode =
            this.patientChartNode.type === PatientChartNodeType.RootNode;

        const reportDataTreeNodePromise = isRootNode
            ? this.generateReportDataTreeWithHeaderAndFooter()
            : this.generateReportDataTreeNode(this.patientChartNode);

        reportDataTreeNodePromise
            .then((reportDataTree: ReportDataTreeNode) => {
                this.updateReportContent(reportDataTree);
            })
    }

    private generateReportDataTreeNode(patientChartNode: PatientChartNode): Promise<ReportDataTreeNode> {
        const reportDataTreeNode = new ReportDataTreeNode();
        reportDataTreeNode.patientChartNodeId = patientChartNode.id;

        const patientChartNodeReportInfo =
            new PatientChartNodeReportInfo(this.patientId, patientChartNode, this.admissionId, this.appointmentId);

        return this.reportSectionService
            .getPatientChartNodeContent(patientChartNodeReportInfo)
            .then(htmlContent => {
                if (htmlContent)
                    reportDataTreeNode.html = htmlContent;

                const childrenNodes = patientChartNode.children;

                if (!childrenNodes || !childrenNodes.length)
                    return reportDataTreeNode;

                const childrenNodesPromises: Promise<any>[] = []

                for (let i = 0; i < childrenNodes.length; i++) {
                    const childNode = childrenNodes[i];
                    const childNodePromise =
                        this.generateReportDataTreeNode(childNode);

                    childrenNodesPromises.push(childNodePromise);
                }

                return Promise.all(childrenNodesPromises)
                    .then(childrenDataTreeNodes => {
                        for (let i = 0; i < childrenDataTreeNodes.length; i++) {
                            const childrenDataTreeNode = childrenDataTreeNodes[i];
                            reportDataTreeNode.childrenNodes.push(childrenDataTreeNode);
                        }

                        return reportDataTreeNode;
                    })

            });
    }

    private generateReportDataTreeWithHeaderAndFooter(): Promise<ReportDataTreeNode> {
        const reportDataTreeRootNode = new ReportDataTreeNode();

        const headerHtmlPromise = this.getReportHeader();
        const footerHtmlPromise = this.getReportFooter(this.isSignedOff);
        const reportDataTreeBodyPromise = this.generateReportDataTreeNode(this.patientChartNode);

        return Promise.all([headerHtmlPromise, footerHtmlPromise, reportDataTreeBodyPromise])
            .then(result => {
                const reportHeaderHtml = result[0];
                const reportFooterHtml = result[1];
                const reportDataTreeBody = result[2];

                const reportDataTreeHeader =
                    new ReportDataTreeNode(GuidHelper.generateNewGuid(), reportHeaderHtml);

                reportDataTreeRootNode.childrenNodes.push(reportDataTreeHeader)
                reportDataTreeRootNode.childrenNodes.push(reportDataTreeBody);

                if (reportFooterHtml) {
                    const reportDataTreeFooter =
                        new ReportDataTreeNode("", reportFooterHtml);

                    reportDataTreeRootNode.childrenNodes
                        .push(reportDataTreeFooter);
                }

                return reportDataTreeRootNode;
            });
    }

    private getReportHeader(): Promise<string> {
        const admission = new Admission();
        admission.patientId = this.patientId;
        admission.appointmentId = this.appointmentId;

        return this.patientChartReportHeaderService
            .getPatientChartNodeReportContent(admission, this.companyId, true);
    }

    private getReportFooter(isPatientAdmissionSignedOff: boolean): Promise<string> {
        if (!isPatientAdmissionSignedOff)
            return Promise.resolve("");

        return this.patientChartReportFooterService
            .getPatientChartNodeReportContent(this.admissionId);
    }

    private updateReportContent(reportDataTreeNode: ReportDataTreeNode) {
        const reportNodeContent = this.generateReportContent("", reportDataTreeNode);
        this.reportNodeContent = `<div style="width:100%;">${reportNodeContent}</div>`;
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
}