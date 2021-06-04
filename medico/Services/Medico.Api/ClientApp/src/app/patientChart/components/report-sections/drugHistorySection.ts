import { DefaultValueService } from 'src/app/_services/default-value.service';
import { DrugHistoryService } from '../../patient-chart-tree/services/drug-history.service';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { BaseHistoryReportSection, IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';

export class DrugHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private drugHistoryDataService: DrugHistoryService,
        defaultValueProvider: DefaultValueService) {
        super(defaultValueProvider);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.drugHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(drugHistory => {
                const drugHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!drugHistory.length) {
                    return this.getSectionDefaultValue(drugHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type)
                }
                else {
                    const drugHistoryProperties = [
                        { name: "status", isFirstItem: true },
                        { name: "type" },
                        { name: "amount" },
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

                    const drugHistoryStr =
                        this.getHistorySectionString(drugHistory, drugHistoryProperties);

                    return StringHelper.format(drugHistoryTemplate, drugHistoryStr);
                }
            });
    }
}