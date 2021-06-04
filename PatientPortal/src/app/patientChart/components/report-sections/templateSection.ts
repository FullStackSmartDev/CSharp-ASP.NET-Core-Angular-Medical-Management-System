import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { PatientSelectableRootComponent } from 'src/app/share/components/patient-selectable-root/patient-selectable-root.component';
import { PatientChartService } from '../../services/patient-chart.service';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { PatientSelectableListComponent } from 'src/app/share/components/patient-selectable-list/patient-selectable-list.component';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { AlertService } from 'src/app/_services/alert.service';
import { PatientSelectableDateComponent } from 'src/app/share/components/patient-selectable-date/patient-selectable-date.component';
import { PatientSelectableRangeComponent } from 'src/app/share/components/patient-selectable-range/patient-selectable-range.component';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class TemplateSection implements IReportSection {
    selectableRoot: PatientSelectableRootComponent = new PatientSelectableRootComponent();

    constructor(private patientChartService: PatientChartService,
        private selectableItemHtmlService: SelectableItemHtmlService,
        selectableListService: SelectableListService,
        alertService: AlertService) {

        this.selectableRoot.patientSelectableList =
            new PatientSelectableListComponent(selectableItemHtmlService, selectableListService, alertService);

        this.selectableRoot.patientSelectableDate =
            new PatientSelectableDateComponent(alertService, selectableItemHtmlService);

        this.selectableRoot.patientSelectableRange =
            new PatientSelectableRangeComponent(selectableItemHtmlService, alertService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientChartTree =
            JSON.parse(reportSectionInfo.admission.admissionData).patientRoot;

        const patientChartTemplateContent =
            this.getTemplateContent(patientChartTree, reportSectionInfo.templateName);

        const patientChartTemplateReportContent = 
            `<div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.templateSection}">
                ${patientChartTemplateContent}
            </div>`

        return Promise.resolve(patientChartTemplateReportContent);
    }

    private getTemplateContent(patientChartTree: any, templateName: string): string {
        const patientChartTemplateSection = this.patientChartService
            .getPatientChartSectionByName(templateName, patientChartTree);

        const contentTemplate = `<div><b>${patientChartTemplateSection.title}:</b></div>{0}`;

        const templateContent = patientChartTemplateSection.value;

        let templateHtml =
            templateContent[templateContent.isDetailedTemplateUsed ? "detailedTemplateHtml" : "defaultTemplateHtml"];

        if (templateContent.isDetailedTemplateUsed) {
            templateHtml = this.wrapAllSelectableListValuesToBoldTag(templateHtml);
        }

        return StringHelper.format(contentTemplate, templateHtml);
    }

    private wrapAllSelectableListValuesToBoldTag(templateHtml: any): string {
        const metadataRegexps = [
            this.selectableRoot.patientSelectableDate.metadataCodeRegexp,
            this.selectableRoot.patientSelectableList.metadataCodeRegexp,
            this.selectableRoot.patientSelectableRange.metadataCodeRegexp
        ];
        return this.selectableItemHtmlService
            .wrapBoldTagAroundSelectableElementsValues(templateHtml, metadataRegexps);
    }
}