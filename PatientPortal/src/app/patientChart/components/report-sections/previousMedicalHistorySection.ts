import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { MedicalHistoryService } from '../../patient-chart-tree/services/medical-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class PreviousMedicalHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicalHistoryDataService: MedicalHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.medicalHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(medicalHistory => {
                let medicalHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.previousMedicalHistory}">
                            <div><b>Previous Medical History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicalHistory.length) {
                    return this.getSectionDefaultValue(medicalHistoryTemplate, "medicalhistory");
                }
                else {
                    let diagnosis = "";
                    for (let i = 0; i < medicalHistory.length; i++) {
                        const medicalHistoryItem = medicalHistory[i];
                        diagnosis += `
                            <li>
                                <div><b>${medicalHistoryItem.diagnosis}</b></div>
                                <div>${medicalHistoryItem.notes ? medicalHistoryItem.notes : ""}</div>
                            </li>`;
                    }

                    return StringHelper.format(medicalHistoryTemplate, diagnosis);
                }
            });
    }
}