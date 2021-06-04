import { Component, Input, AfterViewInit, OnDestroy, ViewChild } from "@angular/core";
import { Admission } from "../../dataModels/admission";
import { DxTreeViewComponent } from "devextreme-angular";
import { ReportSectionNames } from "../../constants/reportSectionNames";
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { PatientDataModelNode } from "../../provider/patienDataModelService";
import { ReportSectionProvider } from "../../provider/report/reportSectionProvider";
import { ReportSectionInfo } from "../../provider/report/sections/baseHistoryReportSection";
import { LoadPanelService } from "../../provider/loadPanelService";
import { SignatureInfoAppService } from "../../provider/appServices/signatureInfoAppService";
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { saveAs } from 'file-saver';
import { ApiUrl } from "../../constants/apiUrls";

declare const tinymce: any;

@Component({
    templateUrl: "reportComponent.html",
    selector: "report"
})
export class ReportComponent implements AfterViewInit, OnDestroy {
    @Input("patientAdmissionModelTree") patientAdmissionModelTree: PatientDataModelNode[] = [];
    @Input("patientAdmission") patientAdmission: Admission;

    @ViewChild("patientTree") patientTree: DxTreeViewComponent;

    reportDataTree: ReportDataTreeSection;

    reportEditorId: string = "report-editor";
    reportEditor: any;
    reportContent: string = ``;

    _reportUrl: string = `${ApiUrl.url}report`;

    constructor(private reportSectionProvider: ReportSectionProvider,
        private loadPanelService: LoadPanelService,
        private signatureInfoAppService: SignatureInfoAppService,
        private http: Http) {
    }

    generatePdfReport() {
        const reportBody = this.reportEditor.getBody();

        this.loadPanelService.showLoader();

        const opts = new RequestOptions();

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        opts.headers = headers;

        opts.responseType = ResponseContentType.Blob;

        const reportContent = {
            reportContent: reportBody.innerHTML
        }

        return this.http.post(this._reportUrl, reportContent,  opts)
            .toPromise()
            .then((response) => {
                this.loadPanelService.hideLoader();
                var blob = new Blob([response["_body"]], { type: 'application/pdf' });
                saveAs(blob, 'report.pdf');
            })
            .catch(err => { 
                this.loadPanelService.hideLoader();
                console.log(err) 
            });

        // reportBody.style.padding = "20pt";

        // this.loadPanelService.showLoader();

        // const self = this;

        // html2canvas(reportBody, { logging: true, letterRendering: 1, allowTaint: false, useCORS: true })
        //     .then(function (canvas) {
        //         const contentDataURL = canvas.toDataURL('image/png')

        //         const imgWidth = 210;
        //         const pageHeight = 295;

        //         const imgHeight = canvas.height * imgWidth / canvas.width;
        //         let heightLeft = imgHeight;

        //         const pdf = new jsPDF('p', 'mm');
        //         let position = 0;

        //         pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

        //         heightLeft -= pageHeight;

        //         while (heightLeft >= 0) {
        //             position = heightLeft - imgHeight;
        //             pdf.addPage();
        //             pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        //             heightLeft -= pageHeight;
        //         }

        //         self.loadPanelService.hideLoader();

        //         pdf.save('report.pdf');
        //     });
    }

    ngAfterViewInit(): void {
        this.initPatientTreeDataSource();
        this.setUpReportEditor();
    }

    ngOnDestroy(): void {
        tinymce.remove(this.reportEditor);
    }

    patientDataTreeSectionSelectionChanged($event): void {
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
        const reportDataTreeRootSection =
            new ReportDataTreeSection("reportDataTree");

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
            new ReportSectionInfo(this.patientAdmission, sectionName);

        return this.reportSectionProvider
            .getReportSectionHtml(sectionInfo)
    }

    private generateDataTreeReportBody(): ReportDataTreeSection {
        const patientAdmissionTree = this.patientAdmissionModelTree[0];
        return this.convertPatientAdmissionTreeToReportDataTree(patientAdmissionTree);
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

        const reportSectionInfo = new ReportSectionInfo(this.patientAdmission, sectionName, templateName);

        return this.reportSectionProvider
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
                    this.signatureInfoAppService.isAdmissionSignedOff(this.patientAdmission.Id)
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
            JSON.parse(JSON.stringify(this.patientAdmissionModelTree));

        this.patientTree.dataSource = patientAdmissionModelTreeCopy;
    }
}

export class ReportDataTreeSection {
    name: string;
    templteName: string;
    html: string;
    childSections: ReportDataTreeSection[];

    constructor(name: string = "", html: string = "",
        childSections: ReportDataTreeSection[] = [], templateName: string = "") {
        this.name = name;
        this.templteName = templateName;
        this.html = html;
        this.childSections = childSections;
    }
}