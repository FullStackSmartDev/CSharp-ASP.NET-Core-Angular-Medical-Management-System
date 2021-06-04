import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { FamilyHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class FamilyHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private familyHistoryDataService: FamilyHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.familyHistoryDataService
            .search(loadOptions)
            .then(familyHistory => {
                const familyHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.familyHistory}">
                            <div><b>Family History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!familyHistory.length) {
                    return this.getSectionDefaultValue(familyHistoryTemplate,
                        PatientHistoryNames.familyHistory);
                }
                else {
                    let familyDiagnosis = "";

                    for (let i = 0; i < familyHistory.length; i++) {
                        const familyHistoryItem = familyHistory[i];
                        familyDiagnosis += `
                            <li>
                                <div><b>${familyHistoryItem.Diagnosis}</b> - ${familyHistoryItem.FamilyMember} - ${familyHistoryItem.FamilyStatus}</div>
                                <div>${familyHistoryItem.Notes}</div>
                            </li>`;
                    }

                    return StringHelper.format(familyHistoryTemplate, familyDiagnosis);
                }
            });
    }
}