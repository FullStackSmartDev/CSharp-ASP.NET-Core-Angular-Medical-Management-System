import { IReportSection, ReportSectionInfo, BaseHistoryReportSection } from "./baseHistoryReportSection";
import { TobaccoHistoryService } from '../../patient-chart-tree/services/tobacco-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class TobaccoHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private tobaccoHistoryService: TobaccoHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.tobaccoHistoryService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(tobaccoHistory => {
                let tobaccoHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.tobaccoHistory}">
                            <div><b>Tobacco history:</b><div>
                            <ul style="list-style-type:square;line-height:1em;">
                                {0}
                            </ul>
                        </div>`;

                if (!tobaccoHistory.length) {
                    return this.getSectionDefaultValue(tobaccoHistoryTemplate, ReportSectionNames.tobaccoHistory)
                }
                else {
                    const tobaccoHistoryStr = this.getTobaccoHistoryString(tobaccoHistory);
                    return StringHelper.format(tobaccoHistoryTemplate, tobaccoHistoryStr);
                }
            });
    }

    private getTobaccoHistoryString(tobaccoHistory: any[]): string {
        let tobaccoHistoryStr = "";
        const tobaccoHistoryProperties = [
            { name: "status", isFirstItem: true },
            { name: "type" },
            { name: "amount" },
            { name: "use" },
            { name: "frequency" },
            { name: "length" },
            { name: "duration" },
            { name: "quit" },
            { name: "statusLength", dependsOn: "quit" },
            { name: "statusLengthType", dependsOn: "quit" },
            { name: "notes" }
        ]

        for (let i = 0; i < tobaccoHistory.length; i++) {
            const tobaccoHistoryItem = tobaccoHistory[i];
            tobaccoHistoryStr += "<li>";

            for (let j = 0; j < tobaccoHistoryProperties.length; j++) {
                const tobaccoHistoryProp = tobaccoHistoryProperties[j];

                const propName = tobaccoHistoryProp["name"];
                const dependsOnProp = tobaccoHistoryProp["dependsOn"];
                const isFirstItem = tobaccoHistoryProp["isFirstItem"];

                if (dependsOnProp) {
                    tobaccoHistoryStr += tobaccoHistoryItem[dependsOnProp] && tobaccoHistoryItem[propName]
                        ? isFirstItem ? tobaccoHistoryItem[propName] : ` - ${tobaccoHistoryItem[propName]}`
                        : ""
                }
                else {
                    tobaccoHistoryStr += tobaccoHistoryItem[propName]
                        ? isFirstItem ? tobaccoHistoryItem[propName] : ` - ${tobaccoHistoryItem[propName]}`
                        : ""
                }
            }
        }

        return tobaccoHistoryStr;
    }
}