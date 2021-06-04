import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { EducationHistoryService } from '../../patient-chart-tree/services/education-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class EducationSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private educationHistoryDataService: EducationHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.educationHistoryDataService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(educationHistory => {
                let educationHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.education}">
                            <div><b>Education:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!educationHistory.length) {
                    return this.getSectionDefaultValue(educationHistoryTemplate, "educationhistory");
                }
                else {
                    let educationList = "";

                    for (let i = 0; i < educationHistory.length; i++) {
                        const educationItem = educationHistory[i];
                        educationList += `
                            <li>
                                <div>${educationItem.degree} - ${educationItem.yearCompleted}</div>
                                <div>${educationItem.notes ? educationItem.notes : ""}</div>
                            </li>`;
                    }

                    return StringHelper.format(educationHistoryTemplate, educationList);
                }
            });
    }
}