import { BaseHistoryReportSection, PatientChartNodeReportInfo, IReportContentProvider } from "./baseHistoryReportSection";
import { MedicalHistoryService } from '../../patient-chart-tree/services/medical-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class PreviousMedicalHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private medicalHistoryDataService: MedicalHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.medicalHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(medicalHistory => {
                const medicalHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!medicalHistory.length) {
                    return this.getSectionDefaultValue(medicalHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type);
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