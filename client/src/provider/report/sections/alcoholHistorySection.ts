import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { AlcoholHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";
import { StringHelper } from "../../../helpers/stringHelper";

export class AlcoholHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private alcoholHistoryDataService: AlcoholHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreateDate");

        return this.alcoholHistoryDataService.search(loadOptions)
            .then(alcoholHistory => {
                let alcoholHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.alcoholHistory}">
                            <div><b>Alcohol History:</b><div>
                            <ul style="list-style-type:square;">
                                {0}
                            </ul>
                        </div>`;

                if (!alcoholHistory.length) {
                    return this.getSectionDefaultValue(alcoholHistoryTemplate,
                        PatientHistoryNames.alcoholHistory)
                }
                else {
                    const alcoholHistoryStr =
                        this.getAlcoholHistoryString(alcoholHistory);

                    return StringHelper
                        .format(alcoholHistoryTemplate, alcoholHistoryStr);
                }

            });
    }

    private getAlcoholHistoryString(alcoholHistory: any[]): string {
        let alcoholHistoryStr = "";
        const alcoholHistoryProperties = [
            { name: "Status", isFirstItem: true },
            { name: "Type" },
            { name: "Amount" },
            { name: "Use" },
            { name: "Route" },
            { name: "Frequency" },
            { name: "Length" },
            { name: "Duration" },
            { name: "Quit" },
            { name: "StatusLength", dependsOn: "Quit" },
            { name: "StatusLengthType", dependsOn: "Quit" },
            { name: "Notes" }
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