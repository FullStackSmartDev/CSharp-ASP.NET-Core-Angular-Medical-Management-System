import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { AlcoholHistoryService } from '../../patient-chart-tree/services/alcohol-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class AlcoholHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private alcoholHistoryDataService: AlcoholHistoryService,
        defaultValuesProvider: DefaultValueService) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.alcoholHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(alcoholHistory => {
                let alcoholHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.alcoholHistory}">
                            <div><b>Alcohol History:</b><div>
                            <ul style="list-style-type:square;">
                                {0}
                            </ul>
                        </div>`;

                if (!alcoholHistory.length) {
                    return this.getSectionDefaultValue(alcoholHistoryTemplate, ReportSectionNames.alcoholHistory)
                }
                else {
                    const alcoholHistoryStr = this.getAlcoholHistoryString(alcoholHistory);
                    return StringHelper.format(alcoholHistoryTemplate, alcoholHistoryStr);
                }

            });
    }

    private getAlcoholHistoryString(alcoholHistory: any[]): string {
        let alcoholHistoryStr = "";
        const alcoholHistoryProperties = [
            { name: "status", isFirstItem: true },
            { name: "type" },
            { name: "smount" },
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

        for (let i = 0; i < alcoholHistory.length; i++) {
            const alcoholHistoryItem = alcoholHistory[i];
            alcoholHistoryStr += "<li>";

            for (let j = 0; j < alcoholHistoryProperties.length; j++) {
                const alcoholHistoryProp = alcoholHistoryProperties[j];

                const propName = alcoholHistoryProp["name"];
                const dependsOnProp = alcoholHistoryProp["dependsOn"];
                const isFirstItem = alcoholHistoryProp["isFirstItem"];

                if (dependsOnProp) {
                    alcoholHistoryStr += alcoholHistoryItem[dependsOnProp] && alcoholHistoryItem[propName]
                        ? isFirstItem ? alcoholHistoryItem[propName] : ` - ${alcoholHistoryItem[propName]}`
                        : ""
                }
                else {
                    alcoholHistoryStr += alcoholHistoryItem[propName]
                        ? isFirstItem ? alcoholHistoryItem[propName] : ` - ${alcoholHistoryItem[propName]}`
                        : ""
                }
            }
        }

        return alcoholHistoryStr;
    }
}