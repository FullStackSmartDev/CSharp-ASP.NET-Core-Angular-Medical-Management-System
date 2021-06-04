import { BaseHistoryReportSection, IReportContentProvider, PatientChartNodeReportInfo } from "./baseHistoryReportSection";
import { EducationHistoryService } from '../../patient-chart-tree/services/education-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class EducationSection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private educationHistoryDataService: EducationHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.educationHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(educationHistory => {
                const educationHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!educationHistory.length) {
                    return this.getSectionDefaultValue(educationHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type);
                }
                else {
                    const educationHistoryProperties = [
                        { name: "degree", isFirstItem: true },
                        { name: "yearCompleted" },
                        { name: "notes" }
                    ];

                    const educationHistoryStr =
                        this.getHistorySectionString(educationHistory, educationHistoryProperties);

                    return StringHelper.format(educationHistoryTemplate, educationHistoryStr);
                }
            });
    }
}