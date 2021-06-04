import { BaseHistoryReportSection, PatientChartNodeReportInfo, IReportContentProvider } from "./baseHistoryReportSection";
import { AlcoholHistoryService } from '../../patient-chart-tree/services/alcohol-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class AlcoholHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private alcoholHistoryDataService: AlcoholHistoryService,
        defaultValuesProvider: DefaultValueService) {
        super(defaultValuesProvider);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.alcoholHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(alcoholHistory => {
                const alcoholHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!alcoholHistory.length) {
                    return this.getSectionDefaultValue(alcoholHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type)
                }
                else {
                    const alcoholHistoryProperties = [
                        { name: "status", isFirstItem: true },
                        { name: "type" },
                        { name: "smount" },
                        { name: "use" },
                        { name: "route" },
                        { name: "frequency" },
                        { name: "length" },
                        { name: "duration" },
                        { name: "quit" },
                        { name: "statusLength", dependsOn: "quit" },
                        { name: "statusLengthType", dependsOn: "quit" },
                        { name: "notes" }
                    ];

                    const alcoholHistoryStr =
                        this.getHistorySectionString(alcoholHistory, alcoholHistoryProperties);

                    return StringHelper.format(alcoholHistoryTemplate, alcoholHistoryStr);
                }
            });
    }
}