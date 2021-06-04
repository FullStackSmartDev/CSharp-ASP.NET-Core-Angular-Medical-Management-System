import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { MedicalHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";
import { StringHelper } from "../../../helpers/stringHelper";

export class PreviousMedicalHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicalHistoryDataService: MedicalHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.medicalHistoryDataService.search(loadOptions)
            .then(medicalHistory => {
                let medicalHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.previousMedicalHistory}">
                            <div><b>Previous Medical History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicalHistory.length) {
                    return this.getSectionDefaultValue(medicalHistoryTemplate,
                        PatientHistoryNames.medicalHistory);
                }
                else {
                    let diagnosis = "";
                    for (let i = 0; i < medicalHistory.length; i++) {
                        const medicalHistoryItem = medicalHistory[i];
                        diagnosis += `
                            <li>
                                <div><b>${medicalHistoryItem.Diagnosis}</b></div>
                                <div>${medicalHistoryItem.Notes}</div>
                            </li>`;
                    }

                    return StringHelper.format(medicalHistoryTemplate, diagnosis);
                }
            });
    }
}