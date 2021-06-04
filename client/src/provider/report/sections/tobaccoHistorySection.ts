import { IReportSection, ReportSectionInfo, BaseHistoryReportSection } from "./baseHistoryReportSection";
import { TobaccoHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { StringHelper } from "../../../helpers/stringHelper";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class TobaccoHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private tobaccoHistoryDataService: TobaccoHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreateDate");

        return this.tobaccoHistoryDataService.search(loadOptions)
            .then(tobaccoHistory => {
                let tobaccoHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.tobaccoHistory}">
                            <div><b>Tobacco history:</b><div>
                            <ul style="list-style-type:square;line-height:1em;">
                                {0}
                            </ul>
                        </div>`;

                if (!tobaccoHistory.length) {
                    return this.getSectionDefaultValue(tobaccoHistoryTemplate,
                        PatientHistoryNames.tobaccoHistory)
                }
                else {
                    const tobaccoHistoryStr =
                        this.getTobaccoHistoryString(tobaccoHistory);

                    return StringHelper
                        .format(tobaccoHistoryTemplate, tobaccoHistoryStr);
                }
            });
    }

    private getTobaccoHistoryString(tobaccoHistory: any[]): string {
        let tobaccoHistoryStr = "";
        const tobaccoHistoryProperties = [
            { name: "Status", isFirstItem: true },
            { name: "Type" },
            { name: "Amount" },
            { name: "Use" },
            { name: "Frequency" },
            { name: "Length" },
            { name: "Duration" },
            { name: "Quit" },
            { name: "StatusLength", dependsOn: "Quit" },
            { name: "StatusLengthType", dependsOn: "Quit" },
            { name: "Notes" }
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