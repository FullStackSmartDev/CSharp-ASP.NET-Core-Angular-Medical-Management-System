import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { OccupationalHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { DateHelper } from "../../../helpers/dateHelpers";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class OccupationalHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private occupationalHistoryDataService: OccupationalHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "Start");

        return this.occupationalHistoryDataService.search(loadOptions)
            .then(occupationalHistory => {
                let occupationalHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.occupationalHistory}">
                            <div><b>Occupational history:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!occupationalHistory.length) {
                    return this.getSectionDefaultValue(occupationalHistoryTemplate,
                        PatientHistoryNames.occupationalHistory);
                }
                else {
                    let occupationalList = "";

                    occupationalList = occupationalHistory
                        .reduce((occupationalList, occupationalItem) => {
                            const startDate = occupationalItem.Start;
                            const endDate = occupationalItem.End;

                            const totalDaysCount =
                                DateHelper.getDaysBetween(startDate, endDate);

                            let occupationalListItem = occupationalList + `<li>${occupationalItem.OccupationalType} - ${totalDaysCount}`;

                            if (occupationalItem.DisabilityClaimDetails) {
                                occupationalListItem += ` - ${occupationalItem.DisabilityClaimDetails}`;
                            }

                            if (occupationalItem.WorkersCompensationClaimDetails) {
                                occupationalListItem += ` - ${occupationalItem.WorkersCompensationClaimDetails}`;
                            }

                            occupationalListItem += ` - ${occupationalItem.EmploymentStatus}</li>`;

                            return occupationalListItem;

                        }, occupationalList);

                    return StringHelper.format(occupationalHistoryTemplate, occupationalList);
                }
            });
    }
}