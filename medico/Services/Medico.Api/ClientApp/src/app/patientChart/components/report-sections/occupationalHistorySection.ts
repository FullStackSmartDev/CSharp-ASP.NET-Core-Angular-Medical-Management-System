import { BaseHistoryReportSection, IReportContentProvider, PatientChartNodeReportInfo } from "./baseHistoryReportSection";
import { OccupationalHistoryService } from '../../patient-chart-tree/services/occupational-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { FormattedOccupationalHistory } from '../../models/formattedOccupationalHistory';
import { OccupationalHistory } from '../../models/occupationalHistory';

export class OccupationalHistorySection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private occupationalHistoryDataService: OccupationalHistoryService, defaultValuesProvider: DefaultValueService) {
        super(defaultValuesProvider);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.occupationalHistoryDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(occupationalHistory => {
                const occupationalHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!occupationalHistory.length) {
                    return this.getSectionDefaultValue(occupationalHistoryTemplate,
                        patientChartNodeReportInfo.patientChartNode.type);
                }
                else {
                    const occupationalHistoryProperties = [
                        { name: "occupationalType", isFirstItem: true },
                        { name: "employmentStatus" },
                        { name: "workingDaysNumber" },
                        { name: "disabilityClaimDetails" },
                        { name: "workersCompensationClaimDetails" },
                        { name: "notes" }
                    ];

                    const formattedOccupationalHistory = occupationalHistory
                        .map(this.convertToFormattedOccupationalHistory);

                    const occupationalHistoryStr =
                        this.getHistorySectionString(formattedOccupationalHistory, occupationalHistoryProperties);

                    return StringHelper.format(occupationalHistoryTemplate, occupationalHistoryStr);
                }
            });
    }

    private convertToFormattedOccupationalHistory(occupationalHistory: OccupationalHistory): FormattedOccupationalHistory {
        const formattedHistory = new FormattedOccupationalHistory();

        const startDate = occupationalHistory.start;
        const ednDate = occupationalHistory.end;

        if (!startDate || !ednDate)
            formattedHistory.workingDaysNumber = "";
        else {
            const localStartDate =
                DateHelper.sqlServerUtcDateToLocalJsDate(startDate);

            const localEndDate =
                DateHelper.sqlServerUtcDateToLocalJsDate(ednDate);

            const workingDaysNumber =
                DateHelper.getDaysBetween(localStartDate, localEndDate);

            formattedHistory.workingDaysNumber =
                workingDaysNumber.toString();
        }

        formattedHistory.occupationalType = occupationalHistory.occupationalType;
        formattedHistory.disabilityClaimDetails = occupationalHistory.disabilityClaimDetails;
        formattedHistory.workersCompensationClaimDetails = occupationalHistory.workersCompensationClaimDetails;
        formattedHistory.employmentStatus = occupationalHistory.employmentStatus;
        formattedHistory.notes = occupationalHistory.notes;

        return formattedHistory;
    }
}