import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { DrugHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class DrugHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private drugHistoryDataService: DrugHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreateDate");

        return this.drugHistoryDataService.search(loadOptions)
            .then(drugHistory => {
                let drugHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.drugHistory}">
                            <div><b>Drug history:</b><div>
                            <ul style="list-style-type:square;">
                                {0}
                            </ul>
                        </div>`;

                if (!drugHistory.length) {
                    return this.getSectionDefaultValue(drugHistoryTemplate,
                        PatientHistoryNames.drugHistory)
                }
                else {
                    const drugHistoryStr =
                        this.getDrugHistoryString(drugHistory);

                    return StringHelper
                        .format(drugHistoryTemplate, drugHistoryStr);
                }
            });
    }

    private getDrugHistoryString(drugHistory: any[]): string {
        let drugHistoryStr = "";
        const drugHistoryProperties = [
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

        for (let i = 0; i < drugHistory.length; i++) {
            const drugHistoryItem = drugHistory[i];
            drugHistoryStr += "<li>";

            for (let j = 0; j < drugHistoryProperties.length; j++) {
                const drugHistoryProp = drugHistoryProperties[j];

                const propName = drugHistoryProp["name"];
                const dependsOnProp = drugHistoryProp["dependsOn"];
                const isFirstItem = drugHistoryProp["isFirstItem"];

                if (dependsOnProp) {
                    drugHistoryStr += drugHistoryItem[dependsOnProp] && drugHistoryItem[propName]
                        ? isFirstItem ? drugHistoryItem[propName] : ` - ${drugHistoryItem[propName]}`
                        : ""
                }
                else {
                    drugHistoryStr += drugHistoryItem[propName]
                        ? isFirstItem ? drugHistoryItem[propName] : ` - ${drugHistoryItem[propName]}`
                        : ""
                }
            }
        }

        return drugHistoryStr;
    }
}