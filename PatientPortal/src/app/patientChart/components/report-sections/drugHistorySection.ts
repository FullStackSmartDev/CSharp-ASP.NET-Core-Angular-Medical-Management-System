import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { DrugHistoryService } from '../../patient-chart-tree/services/drug-history.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class DrugHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private drugHistoryDataService: DrugHistoryService,
        defaultValueProvider: DefaultValueService) {
        super(defaultValueProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.drugHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(drugHistory => {
                let drugHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.drugHistory}">
                            <div><b>Drug history:</b><div>
                            <ul style="list-style-type:square;">
                                {0}
                            </ul>
                        </div>`;

                if (!drugHistory.length) {
                    return this.getSectionDefaultValue(drugHistoryTemplate, ReportSectionNames.drugHistory)
                }
                else {
                    const drugHistoryStr = this.getDrugHistoryString(drugHistory);
                    return StringHelper.format(drugHistoryTemplate, drugHistoryStr);
                }
            });
    }

    private getDrugHistoryString(drugHistory: any[]): string {
        let drugHistoryStr = "";
        const drugHistoryProperties = [
            { name: "status", isFirstItem: true },
            { name: "type" },
            { name: "amount" },
            { name: "use" },
            { name: "route" },
            { name: "frequency" },
            { name: "length" },
            { name: "duration" },
            { name: "quit" },
            { name: "statusLength", dependsOn: "quit" },
            { name: "statusLengthType", dependsOn: "quit" },
            { name: "notes" }
        ]

        for (let i = 0; i < drugHistory.length; i++) {
            const drugHistoryItem = drugHistory[i];
            drugHistoryStr += "<li>";

            for (let j = 0; j < drugHistoryProperties.length; j++) {
                const drugHistoryProp = drugHistoryProperties[j];

                const propName = drugHistoryProp["name"];
                const dependsOnProp = drugHistoryProp["dependsOn"];
                const isFirstItem = drugHistoryProp["isFirstItem"];

                const propValue = drugHistoryItem[propName] 
                    ? typeof(drugHistoryItem[propName]) === "string" 
                        ? drugHistoryItem[propName].trim()
                        : drugHistoryItem[propName]
                    : "";

                if (dependsOnProp) {
                    drugHistoryStr += drugHistoryItem[dependsOnProp] && propValue
                        ? isFirstItem 
                            ? propValue 
                            : ` - ${drugHistoryItem[propName]}`
                        : ""
                }
                else {
                    drugHistoryStr += propValue
                        ? isFirstItem 
                            ? propValue 
                            : ` - ${drugHistoryItem[propName]}`
                        : ""
                }
            }
        }

        return drugHistoryStr;
    }
}