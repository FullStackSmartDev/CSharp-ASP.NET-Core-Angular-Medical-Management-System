import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

export class BaseHistoryReportSection {
    constructor(private defaultValuesProvider: DefaultValueService) {
    }

    protected getHistorySectionTemplate(sectionTitle: string) {
        return `
            <div style="margin-top:15px;line-height:1em;">
                <div><b>${sectionTitle}:</b><div>
                <ul style="list-style-type:square;">{0}</ul>
            </div>`;
    }

    protected getSectionDefaultValue(sectionTemplate: string,
        patientChartNodeType: PatientChartNodeType): Promise<string> {
        return this.defaultValuesProvider
            .getByPatientChartNodeType(patientChartNodeType)
            .then(defaultValue => {
                const defaultValueLiTag = `<li>${defaultValue.value}</li>`;
                return StringHelper.format(sectionTemplate, defaultValueLiTag);
            });
    }

    protected getHistorySectionString(historyItems: any[], historyItemProperties: any): string {
        let historyStr = "";

        for (let i = 0; i < historyItems.length; i++) {
            const historyItem = historyItems[i];
            historyStr += "<li>";

            for (let j = 0; j < historyItemProperties.length; j++) {
                const historyProp = historyItemProperties[j];

                const propName = historyProp["name"];
                const dependsOnProp = historyProp["dependsOn"];
                const isFirstItem = historyProp["isFirstItem"];

                const propValue = historyItem[propName]
                    ? typeof (historyItem[propName]) === "string"
                        ? historyItem[propName].trim()
                        : historyItem[propName]
                    : "";

                if (dependsOnProp) {
                    historyStr += historyItem[dependsOnProp] && propValue
                        ? isFirstItem
                            ? propValue
                            : ` - ${propValue}`
                        : ""
                }
                else {
                    historyStr += propValue
                        ? isFirstItem ? propValue : ` - ${propValue}`
                        : ""
                }
            }
        }

        return historyStr;
    }
}

export interface IReportContentProvider {
    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo)
        : Promise<string>;
}

export class PatientChartNodeReportInfo {
    patientId: string;
    patientChartNode: PatientChartNode;
    admissionId: string;
    appointmentId: string;

    constructor(patientId: string,
        patientChartNode: PatientChartNode, admissionId: string, appointmentId: string) {

        this.patientId = patientId;
        this.patientChartNode = patientChartNode;
        this.admissionId = admissionId;
        this.appointmentId = appointmentId;
    }
}