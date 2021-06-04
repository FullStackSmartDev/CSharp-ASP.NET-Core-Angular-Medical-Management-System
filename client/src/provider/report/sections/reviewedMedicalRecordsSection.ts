import { ReportSectionInfo, IReportSection, BaseHistoryReportSection } from "./baseHistoryReportSection";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { MedicalRecordDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";
import { StringHelper } from "../../../helpers/stringHelper";

export class ReviewedMedicalRecordsSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicalRecordDataService: MedicalRecordDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.medicalRecordDataService.search(loadOptions)
            .then(medicalRecord => {
                let medicalRecordTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.reviewedMedicalRecords}">
                            <div><b>Patient medical records reviewed:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicalRecord.length) {
                    return this.getSectionDefaultValue(medicalRecordTemplate,
                        PatientHistoryNames.medicalRecord);
                }
                else {
                    let diagnosis = "";
                    for (let i = 0; i < medicalRecord.length; i++) {
                        const medicalRecordItem = medicalRecord[i];
                        diagnosis += `<li>${medicalRecordItem.Diagnosis}</li>`;
                    }

                    return StringHelper.format(medicalRecordTemplate, diagnosis);
                }
            });
    }
}