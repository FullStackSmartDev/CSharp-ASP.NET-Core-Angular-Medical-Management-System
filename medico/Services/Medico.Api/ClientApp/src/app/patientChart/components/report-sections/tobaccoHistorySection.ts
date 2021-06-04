import { BaseHistoryReportSection, IReportContentProvider, PatientChartNodeReportInfo } from "./baseHistoryReportSection";
import { TobaccoHistoryService } from '../../patient-chart-tree/services/tobacco-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class TobaccoHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private tobaccoHistoryService: TobaccoHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.tobaccoHistoryService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(tobaccoHistory => {
                const tobaccoHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!tobaccoHistory.length) {
                    return this.getSectionDefaultValue(tobaccoHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type)
                }
                else {
                    const tobaccoHistoryProperties = [
                        { name: "status", isFirstItem: true },
                        { name: "type" },
                        { name: "amount" },
                        { name: "use" },
                        { name: "frequency" },
                        { name: "length" },
                        { name: "duration" },
                        { name: "quit" },
                        { name: "statusLength", dependsOn: "quit" },
                        { name: "statusLengthType", dependsOn: "quit" },
                        { name: "notes" }
                    ];

                    const tobaccoHistoryStr =
                        this.getHistorySectionString(tobaccoHistory, tobaccoHistoryProperties);

                    return StringHelper.format(tobaccoHistoryTemplate, tobaccoHistoryStr);
                }
            });
    }
}