import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { ReportSectionNames } from '../../classes/reportSectionNames';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { MedicationPrescriptionService } from '../../patient-chart-tree/services/medication-prescription.service';

export class PrescriptionSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicationPrescriptionService: MedicationPrescriptionService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        return this.medicationPrescriptionService
            .getByAdmissionId(reportSectionInfo.admission.id)
            .then(prescriptions => {
                let presscriptionTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.prescriptionSection}">
                            <div><b>Prescriptions:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!prescriptions.length) {
                    return this.getSectionDefaultValue(presscriptionTemplate, "prescription");
                }
                else {
                    let medicationList = "";

                    medicationList = prescriptions
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


                            return `${medicationList}<li><div>${medicationListItem}</div></li>`

                        }, medicationList);

                    return StringHelper.format(presscriptionTemplate, medicationList);
                }
            });
    }
}