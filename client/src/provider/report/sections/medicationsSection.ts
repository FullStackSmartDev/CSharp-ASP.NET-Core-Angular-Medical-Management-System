import { BaseHistoryReportSection, IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { MedicationHistoryDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";
import { PatientHistoryNames } from "../../../constants/patientHistoryNames";

export class MedicationsSection extends BaseHistoryReportSection implements IReportSection {
    constructor(private medicationHistoryDataService: MedicationHistoryDataService,
        defaultValuesProvider: DefaultValuesProvider) {
        super(defaultValuesProvider);
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const loadOptions =
            this.getPatientHistoryLoadOptions(reportSectionInfo.admission.PatientDemographicId, "CreatedDate");

        return this.medicationHistoryDataService
            .search(loadOptions)
            .then(medicationHistory => {
                let medicationHistoryTemplate = `
                        <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.medications}">
                            <div><b>Medications:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicationHistory.length) {
                    return this.getSectionDefaultValue(medicationHistoryTemplate,
                        PatientHistoryNames.medicationsHistory);
                }
                else {
                    let medicationList = "";

                    medicationList = medicationHistory
                        .reduce((medicationList, medication) => {
                            let medicationListItem = medication.Medication;

                            if (medication.Dose) {
                                medicationListItem += ` - ${medication.Dose}`;
                            }

                            if (medication.Units) {
                                medicationListItem += ` - ${medication.Units}`;
                            }

                            if (medication.DoseSchedule) {
                                medicationListItem += ` - ${medication.DoseSchedule}`;
                            }

                            if (medication.Route) {
                                medicationListItem += ` - ${medication.Route}`;
                            }

                            medicationListItem += ` - PRN: ${medication.Prn}`;

                            if (medication.MedicationStatus) {
                                medicationListItem += ` - ${medication.MedicationStatus}`;
                            }

                            return `${medicationList}<li><div>${medicationListItem}</div><div>${medication.Notes}</div></li>`

                        }, medicationList);

                    return StringHelper.format(medicationHistoryTemplate, medicationList);
                }
            });
    }
}