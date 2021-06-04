import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { AllergyDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class AllergiesSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private allergyDataService: AllergyDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.allergyDataService.search(loadOptions)
            .then(allergies => {
                let allergiesHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.allergies}">
                            <div><b>Allergies:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!allergies.length) {
                    return this.getSectionDefaultValue(allergiesHistoryTemplate,
                        PatientHistoryNames.allergiesHistory);
                }
                else {
                    let allergyList = "";

                    allergyList = allergies
                        .reduce((allergyList, allergy) => {
                            return `${allergyList}<li><div>${allergy.Medication} - ${allergy.Reaction}</div><div>${allergy.Notes}</div></li>`;
                        }, allergyList);

                    return StringHelper.format(allergiesHistoryTemplate, allergyList);
                }
            });
    }
}