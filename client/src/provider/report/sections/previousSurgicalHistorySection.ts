import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { SurgicalHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class PreviousSurgicalHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private surgicalHistoryDataService: SurgicalHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.surgicalHistoryDataService
            .search(loadOptions)
            .then(surgicalHistory => {
                let surgicalHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.previousSurgicalHistory}">
                            <div><b>Previous Surgical History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!surgicalHistory.length) {
                    return this.getSectionDefaultValue(surgicalHistoryTemplate,
                        PatientHistoryNames.surgicalHistory);
                }
                else {
                    let diagnosis = "";

                    for (let i = 0; i < surgicalHistory.length; i++) {
                        const surgicalHistoryItem = surgicalHistory[i];
                        diagnosis += `
                            <li>
                                <div><b>${surgicalHistoryItem.Diagnosis}</b></div>
                                <div>${surgicalHistoryItem.Notes}</div>
                            </li>`;
                    }

                    return StringHelper.format(surgicalHistoryTemplate, diagnosis);
                }
            });
    }
}