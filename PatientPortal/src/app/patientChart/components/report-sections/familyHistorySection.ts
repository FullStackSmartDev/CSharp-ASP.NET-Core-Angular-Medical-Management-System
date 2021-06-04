import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { FamilyHistoryService } from '../../patient-chart-tree/services/family-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class FamilyHistorySection extends BaseHistoryReportSection implements IReportSection {
    constructor(private familyHistoryDataService: FamilyHistoryService, defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.familyHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(familyHistory => {
                const familyHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.familyHistory}">
                            <div><b>Family History:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!familyHistory.length) {
                    return this.getSectionDefaultValue(familyHistoryTemplate,
                        ReportSectionNames.familyHistory);
                }
                else {
                    let familyDiagnosis = "";

                    for (let i = 0; i < familyHistory.length; i++) {
                        const familyHistoryItem = familyHistory[i];
                        familyDiagnosis += `
                            <li>
                                <div><b>${familyHistoryItem.diagnosis}</b> - ${familyHistoryItem.familyMember} - ${familyHistoryItem.familyStatus}</div>
                                <div>${familyHistoryItem.notes ? familyHistoryItem.notes : ""}</div>
                            </li>`;
                    }

                    return StringHelper.format(familyHistoryTemplate, familyDiagnosis);
                }
            });
    }
}