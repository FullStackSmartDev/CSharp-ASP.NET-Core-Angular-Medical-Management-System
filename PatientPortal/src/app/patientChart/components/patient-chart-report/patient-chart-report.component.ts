import { Component, Input, ViewChild } from "@angular/core";
import { DxTreeViewComponent } from "devextreme-angular";
import { ReportSectionService } from "../../services/report-section.service";
import { SignatureInfoService } from "../../services/signature-info.service";
import { HttpClient } from "@angular/common/http";
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { ReportSectionInfo } from '../report-sections/baseHistoryReportSection';
import { ConfigService } from 'src/app/_services/config.service';
import { AlertService } from 'src/app/_services/alert.service';
import { saveAs } from 'file-saver';
import { PatientInsuranceService } from 'src/app/_services/patient-insurance.service';
import { PatientDataModelNode } from '../../classes/patientDataModelNode';
import { ReportDataTreeSection } from '../../classes/reportDataTreeSection';

declare const tinymce: any;

@Component({
    templateUrl: "patient-chart-report.component.html",
    selector: "patient-chart-report"
})

export class PatientChartReportComponent {
    @Input("patientChartProjectionTree") patientChartProjectionTree: any[] = [];
    @Input("admission") admission: any;

    @ViewChild("patientChartTree", { static: false }) patientChartTree: DxTreeViewComponent;

    reportDataTree: ReportDataTreeSection;

    reportEditorId: string = "report-editor";
    reportEditor: any;
    reportContent: string = "";

    reportUrl: string = "";

    constructor(private reportSectionService: ReportSectionService,
        private signatureInfoAppService: SignatureInfoService,
        private httpClient: HttpClient,
        private config: ConfigService,
        private alertService: AlertService,
        private patientInsuranceService: PatientInsuranceService) {

        this.reportUrl = `${this.config.apiUrl}report`;
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
            }).catch(error => this.alertService.error(error.message ? error.message : error));

    }

    ngAfterViewInit(): void {
        this.initPatientTreeDataSource();
        this.setUpReportEditor();
    }

    ngOnDestroy(): void {
        tinymce.remove(this.reportEditor);
    }

    patientChartSectionSelectionChanged($event): void {
        const patientTreeNode = $event.node;
        const isSectionSelected = $event.node.selected;

        if (isSectionSelected) {
            this.addSection(patientTreeNode);
        }

        else {
            this.removeSection(patientTreeNode.itemData.name);
        }
    }

    private initReportDataTree(isPatientAdmissionSignedOff: boolean) {
        const reportDataTreeRootSection = new ReportDataTreeSection("reportDataTree");

        const headerHtmlPromise = this.getReportHeaderHtml();
        const footerHtmlPromise = this.getReportFooterHtml(isPatientAdmissionSignedOff);

        Promise.all([headerHtmlPromise, footerHtmlPromise])
            .then(result => {
                const reportHeaderHtml = result[0];
                const reportFooterHtml = result[1];

                const reportDataTreeHeader =
                    new ReportDataTreeSection(ReportSectionNames.patientHeader, reportHeaderHtml);

                const reportDataTreeBody = this.generateDataTreeReportBody();

                reportDataTreeRootSection.childSections
                    .push(reportDataTreeHeader);

                reportDataTreeRootSection.childSections
                    .push(reportDataTreeBody);

                if (reportFooterHtml) {
                    const reportDataTreeFooter =
                        new ReportDataTreeSection(ReportSectionNames.patientFooter, reportFooterHtml);

                    reportDataTreeRootSection.childSections
                        .push(reportDataTreeFooter);
                }

                this.reportDataTree = reportDataTreeRootSection;
                this.updateReportContent();
            });
    }

    private getReportHeaderHtml(): Promise<string> {
        return this.getReportSectionHtml(ReportSectionNames.patientHeader);
    }

    private getReportFooterHtml(isPatientAdmissionSignedOff: boolean): Promise<string> {
        if (!isPatientAdmissionSignedOff)
            return Promise.resolve("");

        return this.getReportSectionHtml(ReportSectionNames.patientFooter);
    }

    private getReportSectionHtml(sectionName: string): Promise<string> {
        const sectionInfo =
            new ReportSectionInfo(this.admission, sectionName);

        return this.reportSectionService
            .getReportSectionHtml(sectionInfo)
    }

    private generateDataTreeReportBody(): ReportDataTreeSection {
        const patientChartTree = this.patientChartProjectionTree[0];
        return this.convertPatientAdmissionTreeToReportDataTree(patientChartTree);
    }

    private convertPatientAdmissionTreeToReportDataTree(patientAdmissionNode: PatientDataModelNode): ReportDataTreeSection {
        const sectionName = patientAdmissionNode.name;
        const section = new ReportDataTreeSection(sectionName);

        if (patientAdmissionNode.templateName) {
            section.templteName = patientAdmissionNode.templateName;
        }

        const childAdmissionNodes = patientAdmissionNode.items;

        if (childAdmissionNodes && childAdmissionNodes.length) {
            for (let i = 0; i < childAdmissionNodes.length; i++) {
                const childAdmissionNode = childAdmissionNodes[i];
                const childSection =
                    this.convertPatientAdmissionTreeToReportDataTree(childAdmissionNode);

                section.childSections.push(childSection);
            }
        }

        return section;
    }

    private generateReportContent(content: string, section: ReportDataTreeSection): string {
        if (section.html) {
            content += section.html;
        }

        const childSections = section.childSections;

        if (childSections.length) {
            for (let i = 0; i < childSections.length; i++) {
                const childSection = childSections[i];
                content = this.generateReportContent(content, childSection);
            }
        }

        return content;
    }

    private updateReportContent(): void {
        const reportContent = this.generateReportContent("", this.reportDataTree);
        this.reportContent = `<div style="width:100%;">${reportContent}</div>`;
        this.reportEditor.setContent(this.reportContent);
    }

    private removeSection(sectionName: string) {
        const reportSection =
            this.getsectionByName(sectionName, this.reportDataTree);

        this.removeSectionsContent(reportSection);
        this.updateReportContent();
    }

    private addSection(patientTreeNode: any): void {
        if (patientTreeNode.itemData.templateName) {
            console.log(`Template Name: ${patientTreeNode.itemData.templateName}`);
        }

        const reportSection =
            this.getsectionByName(patientTreeNode.itemData.name, this.reportDataTree);

        this.addSectionsContent(reportSection)
            .then(() => {
                this.updateReportContent();
            });
    }

    private removeSectionsContent(reportSection: ReportDataTreeSection): void {
        reportSection.html = "";

        const childSections = reportSection.childSections;

        if (childSections.length) {
            for (let i = 0; i < childSections.length; i++) {
                const childSection = childSections[i];

                this.removeSectionsContent(childSection);
            }
        }
    }

    private addSectionsContent(reportSection: ReportDataTreeSection): Promise<any> {
        const sectionName = reportSection.name;;
        const templateName = reportSection.templteName;

        const reportSectionInfo = new ReportSectionInfo(this.admission, sectionName, templateName);

        return this.reportSectionService
            .getReportSectionHtml(reportSectionInfo)
            .then(htmlString => {
                if (htmlString) {
                    reportSection.html = htmlString;
                }

                const childSections = reportSection.childSections;

                if (childSections.length) {
                    const childSectionsPromises: Promise<any>[] = []

                    for (let i = 0; i < childSections.length; i++) {
                        const childSection = childSections[i];
                        const childSectionPromise = this.addSectionsContent(childSection);

                        childSectionsPromises.push(childSectionPromise);
                    }

                    return Promise.all(childSectionsPromises);
                }

                return Promise.resolve([]);
            });
    }

    private getsectionByName(sectionName: string, reportDataTreeSection: ReportDataTreeSection): ReportDataTreeSection {
        if (sectionName === reportDataTreeSection.name) {
            return reportDataTreeSection;
        }

        const childSections = reportDataTreeSection.childSections;

        if (!childSections.length) {
            return null;
        }


        for (let i = 0; i < childSections.length; i++) {
            const childSection = childSections[i];
            const childReportDataTreeSection = this.getsectionByName(sectionName, childSection);

            if (childReportDataTreeSection) {
                return childReportDataTreeSection;
            }
        }

        return null;
    }

    private setUpReportEditor(): void {
        setTimeout(() => {
            tinymce.init({
                extended_valid_elements: "span[id|metadata]",
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

    private initPatientTreeDataSource(): void {
        const patientAdmissionModelTreeCopy =
            JSON.parse(JSON.stringify(this.patientChartProjectionTree));

        const rootSection = patientAdmissionModelTreeCopy[0];
        this.hideSectionsNotVisibleInReport(rootSection);

        this.patientChartTree.dataSource = patientAdmissionModelTreeCopy;
    }

    private hideSectionsNotVisibleInReport(section: PatientDataModelNode) {
        if (section.isNotVisibleInReport) {
            section.visible = false;
            return;
        }

        if (section.items && section.items.length) {

            for (let i = 0; i < section.items.length; i++) {
                this.hideSectionsNotVisibleInReport(section.items[i]);
            }
        }
    }
}