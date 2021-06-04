import { BaseHistoryReportSection, PatientChartNodeReportInfo, IReportContentProvider } from "./baseHistoryReportSection";
import { SurgicalHistoryService } from '../../patient-chart-tree/services/surgical-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class PreviousSurgicalHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private surgicalHistoryDataService: SurgicalHistoryService,
        defaultValuesProvider: DefaultValueService) {
        super(defaultValuesProvider);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.surgicalHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(surgicalHistory => {
                const surgicalHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!surgicalHistory.length) {
                    return this.getSectionDefaultValue(surgicalHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type);
                }
                else {
                    let diagnosis = "";

                    for (let i = 0; i < surgicalHistory.length; i++) {
                        const surgicalHistoryItem = surgicalHistory[i];
                        diagnosis += `
                            <li>
                                <div><b>${surgicalHistoryItem.diagnosis}</b></div>
                                <div>${surgicalHistoryItem.notes ? surgicalHistoryItem.notes : ""}</div>
                            </li>`;
                    }

                    return StringHelper.format(surgicalHistoryTemplate, diagnosis);
                }
            });
    }
}