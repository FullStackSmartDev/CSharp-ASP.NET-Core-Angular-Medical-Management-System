import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { EducationHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class EducationSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private educationHistoryDataService: EducationHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.educationHistoryDataService.search(loadOptions)
            .then(educationHistory => {
                let educationHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.education}">
                            <div><b>Education:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!educationHistory.length) {
                    return this.getSectionDefaultValue(educationHistoryTemplate,
                        PatientHistoryNames.educationHistory);
                }
                else {
                    let educationList = "";

                    for (let i = 0; i < educationHistory.length; i++) {
                        const educationItem = educationHistory[i];
                        educationList += `
                            <li>
                                <div>${educationItem.Degree} - ${educationItem.YearCompleted}</div>
                                <div>${educationItem.Notes}</div>
                            </li>`;
                    }

                    return StringHelper.format(educationHistoryTemplate, educationList);
                }
            });
    }
}