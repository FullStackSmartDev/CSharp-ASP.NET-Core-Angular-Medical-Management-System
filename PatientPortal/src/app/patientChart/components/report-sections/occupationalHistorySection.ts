import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { OccupationalHistoryService } from '../../patient-chart-tree/services/occupational-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class OccupationalHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private occupationalHistoryDataService: OccupationalHistoryService, defaultValuesProvider: DefaultValueService) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.occupationalHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(occupationalHistory => {
                let occupationalHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.occupationalHistory}">
                            <div><b>Occupational history:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!occupationalHistory.length) {
                    return this.getSectionDefaultValue(occupationalHistoryTemplate,
                        ReportSectionNames.occupationalHistory);
                }
                else {
                    let occupationalList = "";

                    occupationalList = occupationalHistory
                        .reduce((occupationalList, occupationalItem) => {
                            const startDate = DateHelper.sqlServerUtcDateToLocalJsDate(occupationalItem.start);
                            const endDate = DateHelper.sqlServerUtcDateToLocalJsDate(occupationalItem.end);

                            const totalDaysCount = DateHelper.getDaysBetween(startDate, endDate);

                            let occupationalListItem = occupationalList + `<li>${occupationalItem.occupationalType} - ${totalDaysCount}`;

                            if (occupationalItem.disabilityClaimDetails) {
                                occupationalListItem += ` - ${occupationalItem.disabilityClaimDetails}`;
                            }

                            if (occupationalItem.workersCompensationClaimDetails) {
                                occupationalListItem += ` - ${occupationalItem.workersCompensationClaimDetails}`;
                            }

                            occupationalListItem += ` - ${occupationalItem.employmentStatus}</li>`;

                            return occupationalListItem;

                        }, occupationalList);

                    return StringHelper.format(occupationalHistoryTemplate, occupationalList);
                }
            });
    }
}