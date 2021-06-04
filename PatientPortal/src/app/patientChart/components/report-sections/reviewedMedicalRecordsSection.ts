import { ReportSectionInfo, IReportSection, BaseHistoryReportSection } from "./baseHistoryReportSection";
import { MedicalRecordService } from '../../patient-chart-tree/services/medical-record.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class ReviewedMedicalRecordsSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicalRecordDataService: MedicalRecordService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.medicalRecordDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(medicalRecord => {
                let medicalRecordTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.reviewedMedicalRecords}">
                            <div><b>Patient medical records reviewed:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicalRecord.length) {
                    return this.getSectionDefaultValue(medicalRecordTemplate, "medicalrecord");
                }
                else {
                    let diagnosis = "";
                    for (let i = 0; i < medicalRecord.length; i++) {
                        const medicalRecordItem = medicalRecord[i];
                        diagnosis += `<li>${medicalRecordItem.documentType}</li>`;
                    }

                    return StringHelper.format(medicalRecordTemplate, diagnosis);
                }
            });
    }
}