import { BaseHistoryReportSection, PatientChartNodeReportInfo, IReportContentProvider } from "./baseHistoryReportSection";
import { FamilyHistoryService } from '../../patient-chart-tree/services/family-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class FamilyHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private familyHistoryDataService: FamilyHistoryService, defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.familyHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(familyHistory => {
                const familyHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;">
                            <div><b>Family History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!familyHistory.length) {
                    return this
                        .getSectionDefaultValue(familyHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type);
                }
                else {
                    const familyHistoryProperties = [
                        { name: "diagnosis", isFirstItem: true },
                        { name: "familyMember" },
                        { name: "familyStatus" },
                        { name: "notes" }
                    ];

                    const familyHistoryStr =
                        this.getHistorySectionString(familyHistory, familyHistoryProperties);

                    return StringHelper.format(familyHistoryTemplate, familyHistoryStr);
                }
            });
    }
}