import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { AllergyService } from '../../patient-chart-tree/services/allergy.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class AllergiesSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private allergyService: AllergyService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.allergyService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(allergies => {
                let allergiesHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.allergies}">
                            <div><b>Allergies:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!allergies.length) {
                    return this.getSectionDefaultValue(allergiesHistoryTemplate, "allergieshistory");
                }
                else {
                    let allergyList = "";

                    allergyList = allergies
                        .reduce((allergyList, allergy) => {
                            return `${allergyList}<li><div>${allergy.medication} - ${allergy.reaction}</div><div>${allergy.notes ? allergy.notes : ""}</div></li>`;
                        }, allergyList);

                    return StringHelper.format(allergiesHistoryTemplate, allergyList);
                }
            });
    }
}