import { BaseHistoryReportSection, IReportContentProvider, PatientChartNodeReportInfo } from "./baseHistoryReportSection";
import { MedicationHistoryService } from '../../patient-chart-tree/services/medication-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class MedicationsSection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private medicationHistoryService: MedicationHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.medicationHistoryService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(medicationHistory => {
                let medicationHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!medicationHistory.length) {
                    return this.getSectionDefaultValue(medicationHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type);
                }
                else {
                    const medicationHistoryProperties = [
                        { name: "medication", isFirstItem: true },
                        { name: "dose" },
                        { name: "units" },
                        { name: "route" },
                        { name: "dosageForm" },
                        { name: "prn" },
                        { name: "medicationStatus" },
                        { name: "notes" }
                    ];

                    const medicationHistoryStr =
                        this.getHistorySectionString(medicationHistory, medicationHistoryProperties);

                    return StringHelper.format(medicationHistoryTemplate, medicationHistoryStr);
                }
            });
    }
}