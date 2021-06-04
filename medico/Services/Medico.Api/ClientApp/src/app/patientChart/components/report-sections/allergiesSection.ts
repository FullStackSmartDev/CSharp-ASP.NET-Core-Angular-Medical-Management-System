import { BaseHistoryReportSection, PatientChartNodeReportInfo, IReportContentProvider } from "./baseHistoryReportSection";
import { AllergyService } from '../../patient-chart-tree/services/allergy.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class AllergiesSection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private allergyService: AllergyService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.allergyService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(allergies => {
                const allergiesHistoryTemplate =
                    this.getHistorySectionTemplate(patientChartNodeReportInfo.patientChartNode.title);

                if (!allergies.length) {
                    return this.getSectionDefaultValue(allergiesHistoryTemplate, patientChartNodeReportInfo.patientChartNode.type);
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