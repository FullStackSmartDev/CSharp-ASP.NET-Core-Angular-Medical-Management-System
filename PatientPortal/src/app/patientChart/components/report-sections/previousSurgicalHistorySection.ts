import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { SurgicalHistoryService } from '../../patient-chart-tree/services/surgical-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class PreviousSurgicalHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private surgicalHistoryDataService: SurgicalHistoryService,
        defaultValuesProvider: DefaultValueService) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.surgicalHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(surgicalHistory => {
                let surgicalHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.previousSurgicalHistory}">
                            <div><b>Previous Surgical History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!surgicalHistory.length) {
                    return this.getSectionDefaultValue(surgicalHistoryTemplate, ReportSectionNames.previousSurgicalHistory);
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