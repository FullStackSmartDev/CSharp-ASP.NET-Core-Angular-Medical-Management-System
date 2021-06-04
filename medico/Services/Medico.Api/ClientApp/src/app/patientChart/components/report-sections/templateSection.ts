import { IReportContentProvider, PatientChartNodeReportInfo } from "./baseHistoryReportSection";
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { PatientChartNode } from 'src/app/_models/patientChartNode';

export class TemplateSection implements IReportContentProvider {
    constructor(private selectableItemHtmlService: SelectableItemHtmlService) {
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        let patientChartTemplateContent =
            this.getTemplateContent(patientChartNodeReportInfo.patientChartNode);

        if (patientChartTemplateContent)
            patientChartTemplateContent =
                this.trimEmptyLinesIfNeeded(patientChartTemplateContent);

        const patientChartTemplateReportContent =
            `<div style="margin-top:15px;line-height:1em;">
                ${patientChartTemplateContent}
            </div>`

        return Promise.resolve(patientChartTemplateReportContent);
    }

    private trimEmptyLinesIfNeeded(patientChartTemplateContent: string): string {
        //replace new lines
        patientChartTemplateContent =
            patientChartTemplateContent.replace(/(\r\n|\n|\r)/gm, "");

        const emptyParagraphs = new RegExp(/(<p>&nbsp;<\/p>)*$/g);
        return patientChartTemplateContent.replace(emptyParagraphs, "");
    }

    private getTemplateContent(templatePatientChartNode: PatientChartNode): string {
        const contentTemplate = `<div><b>${templatePatientChartNode.title}:</b></div>{0}`;

        const templateContent = templatePatientChartNode.value;

        let templateHtml =
            templateContent[templateContent.isDetailedTemplateUsed ? "detailedTemplateHtml" : "defaultTemplateHtml"];

        if (templateContent.isDetailedTemplateUsed) {
            templateHtml = this.wrapAllSelectableListValuesToBoldTag(templateHtml);
        }

        return StringHelper.format(contentTemplate, templateHtml);
    }

    private wrapAllSelectableListValuesToBoldTag(templateHtml: any): string {
        return this.selectableItemHtmlService
            .wrapBoldTagAroundSelectableElementsValues(templateHtml);
    }
}