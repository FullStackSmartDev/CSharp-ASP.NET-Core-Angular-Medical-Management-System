import { ReportSectionInfo, IReportSection } from "./baseHistoryReportSection";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { PatienDataModelService } from "../../patienDataModelService";

export class ChiefComplaintSection implements IReportSection {
    constructor(private patienDataModelService: PatienDataModelService) {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientAdmissionModel =
            JSON.parse(reportSectionInfo.admission.AdmissionData).patientRoot;

        const allegations =
            this.getAllegations(patientAdmissionModel, reportSectionInfo.sectionName);

        if (!allegations) {
            return Promise.resolve("");
        }

        const allegationsTemplate = `
            <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.alcoholHistory}">
                <div><b>Allegations:</b><div>
                <ul style="list-style-type:square;">${allegations}</ul>
            </div>`;

        return Promise.resolve(allegationsTemplate);
    }

    private getAllegations(patientAdmissionModel: any, sectionName: string): string {
        const patientAdmissionSection = this.patienDataModelService
            .getPatientAdmissionSectionByName(sectionName, patientAdmissionModel);

        const patientAdmissionSectionValue = patientAdmissionSection.value;

        if (!patientAdmissionSectionValue) {
            return "";
        }

        const patientAllegationsSets =
            patientAdmissionSectionValue.patientAllegationsSets;

        if (patientAllegationsSets && patientAllegationsSets.length) {
            let allegations = "";

            for (let i = 0; i < patientAllegationsSets.length; i++) {
                const patientAllegationsSet = patientAllegationsSets[i];
                if (patientAllegationsSet.IsDelete) {
                    continue;
                }

                allegations += `<li><p>${patientAllegationsSet.Allegations}</p></li>`;
            }

            return allegations;
        }
        return "";
    }
}