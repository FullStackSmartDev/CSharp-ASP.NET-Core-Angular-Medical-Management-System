import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { MedicationHistoryService } from '../../patient-chart-tree/services/medication-history.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';

export class MedicationsSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicationHistoryService: MedicationHistoryService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.medicationHistoryService.getAllByPatientId(reportSectionInfo.admission.patientId)
            .then(medicationHistory => {
                let medicationHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.medications}">
                            <div><b>Medications:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicationHistory.length) {
                    return this.getSectionDefaultValue(medicationHistoryTemplate, "medicationshistory");
                }
                else {
                    let medicationList = "";

                    medicationList = medicationHistory
                        .reduce((medicationList, medication) => {
                            let medicationListItem = medication.medication;

                            if (medication.dose) {
                                medicationListItem += ` - ${medication.dose}`;
                            }

                            if (medication.units) {
                                medicationListItem += ` - ${medication.units}`;
                            }

                            if (medication.route) {
                                medicationListItem += ` - ${medication.route}`;
                            }

                            if (medication.dosageForm) {
                                medicationListItem += ` - ${medication.dosageForm}`;
                            }

                            medicationListItem += ` - PRN: ${medication.prn}`;

                            if (medication.medicationStatus) {
                                medicationListItem += ` - ${medication.medicationStatus}`;
                            }

                            return `${medicationList}<li><div>${medicationListItem}</div><div>${medication.notes ? medication.notes : ""}</div></li>`

                        }, medicationList);

                    return StringHelper.format(medicationHistoryTemplate, medicationList);
                }
            });
    }   
}