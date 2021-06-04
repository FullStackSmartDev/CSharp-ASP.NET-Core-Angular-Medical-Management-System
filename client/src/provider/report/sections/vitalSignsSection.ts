import { ReportSectionInfo, IReportSection } from "./baseHistoryReportSection";
import { VitalSignsAppService } from "../../appServices/vitalSignsAppService";
import { MedicalCalculationHelper } from "../../../helpers/medicalCalculationHelper";
import { ApplicationConfigurationService } from "../../applicationConfigurationService";
import { DateHelper } from "../../../helpers/dateHelpers";

export class VitalSignsSection implements IReportSection {
    constructor(private vitalSignsAppService: VitalSignsAppService) {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const admissionId = reportSectionInfo.admission.Id;
        const patientId = reportSectionInfo.admission.PatientDemographicId;

        const baseVitalSignsHtmlStringPromise = this.getBaseVitalSignsHtmlString(patientId);
        const vitalSignsHtmlStringPromise = this.getVitalSignsHtmlString(admissionId, patientId);

        return Promise.all([baseVitalSignsHtmlStringPromise, vitalSignsHtmlStringPromise])
            .then(result => {
                const baseVitalSignsHtmlString = result[0];
                const vitalSignsHtmlString = result[1];

                const vitalSignsHeader = "<div style=\"margin-top:10px;\"><b>Vital Signs:</b></div>"

                return `${vitalSignsHeader}${baseVitalSignsHtmlString}${vitalSignsHtmlString}`
            });
    }

    private getVitalSignsHtmlString(admissionId: string, patientId: string): Promise<string> {
        return this.vitalSignsAppService.getPatientVitalSignsByAdmission(patientId, admissionId)
            .then(vitalSigns => {
                if (!vitalSigns.length) {
                    return "";
                }

                let vitalSignsString = `
                    <div style="margin-top:15px;overflow:hidden">
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>Time</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>BP, mm Hg</b></div>
                        <div style="line-height:1.2em;float:left;width:20%;text-align:left;"><b>Position</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>Pulse, bmp</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>Resp, rpm</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>O2 Sat, %</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>Activity</b></div>
                    </div>`

                const emptyValue = ApplicationConfigurationService.emptyValue;

                for (let i = 0; i < vitalSigns.length; i++) {
                    const vitalSignsItem = vitalSigns[i];

                    const time = DateHelper.getTime(vitalSignsItem.CreateDate);
                    const pulse = vitalSignsItem.Pulse ? vitalSignsItem.Pulse : emptyValue;

                    const systolicBloodPressure = vitalSignsItem.SystolicBloodPressure
                        ? vitalSignsItem.SystolicBloodPressure
                        : emptyValue;

                    const diastolicBloodPressure = vitalSignsItem.DiastolicBloodPressure
                        ? vitalSignsItem.DiastolicBloodPressure
                        : emptyValue;

                    const bp = `${systolicBloodPressure} / ${diastolicBloodPressure}`;

                    const respiration = vitalSignsItem.RespirationRate
                        ? vitalSignsItem.RespirationRate
                        : emptyValue;

                    const O2Sat = vitalSignsItem.OxygenSaturationAtRestValue
                        ? vitalSignsItem.OxygenSaturationAtRestValue
                        : emptyValue;

                    const activity = vitalSignsItem.OxygenSaturationAtRest
                        ? vitalSignsItem.OxygenSaturationAtRest
                        : emptyValue;

                    const bloodPressurePosition = vitalSignsItem.BloodPressurePosition
                        ? vitalSignsItem.BloodPressurePosition
                        : emptyValue;

                    const bloodPressureLocation = vitalSignsItem.BloodPressureLocation
                        ? vitalSignsItem.BloodPressureLocation
                        : emptyValue;

                    vitalSignsString += `
                            <div style="margin-top:5px;overflow:hidden">
                                <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${time}</div>
                                <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${bp}</div>
                                <div style="line-height:1.2em;float:left;width:20%;text-align:left;">${bloodPressurePosition} / ${bloodPressureLocation}</div>
                                <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${pulse}</div>
                                <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${respiration}</div>
                                <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${O2Sat}</div>
                                <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${activity}</div>
                            </div>`
                }

                return vitalSignsString;
            });
    }

    private getBaseVitalSignsHtmlString(patientId: string): Promise<string> {
        return this.vitalSignsAppService.getPatientBaseVitalSigns(patientId)
            .then(baseVitalSigns => {
                if (!baseVitalSigns)
                    return "";

                const emptyValue = ApplicationConfigurationService
                    .emptyValue;

                const weight = baseVitalSigns.Weight;
                const height = baseVitalSigns.Height;

                const bmi = MedicalCalculationHelper
                    .calculateBmi(height, weight);

                const dominantHand = baseVitalSigns.DominantHand;
                const oxygen = baseVitalSigns.OxygenUse || baseVitalSigns.OxygenAmount
                    ? baseVitalSigns.OxygenAmount + ' / ' + baseVitalSigns.OxygenUse
                    : emptyValue

                const baseValues = `
                    <div style="margin-top:15px;overflow:hidden">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Weight, lbs</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Height, inches</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>BMI, %</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Dominant Hand</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Oxygen</b></div>
                    </div>
                    <div style="overflow:hidden;margin-top:5px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${weight ? weight : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${height ? height : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${bmi ? bmi : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${dominantHand ? dominantHand : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${oxygen}</div>
                    </div>`;



                const rightLeftValues =
                    `<div style="overflow:hidden;margin-top:15px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Location</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Calf, cm</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Thigh, cm</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Forearm, cm</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Bicep, cm</b></div>
                    </div>
                    <div style="overflow:hidden;margin-top:5px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Right</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${ baseVitalSigns.RightCalf ? baseVitalSigns.RightCalf : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.RightThigh ? baseVitalSigns.RightThigh : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.RightForearm ? baseVitalSigns.RightForearm : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.RightBicep ? baseVitalSigns.RightBicep : emptyValue}</div>
                    </div>
                    <div style="overflow:hidden;margin-top:5px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Left</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.LeftCalf ? baseVitalSigns.LeftCalf : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.LeftThigh ? baseVitalSigns.LeftThigh : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.LeftForearm ? baseVitalSigns.LeftForearm : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.LeftBicep ? baseVitalSigns.LeftBicep : emptyValue}</div>
                    </div>`

                return `${baseValues}${rightLeftValues}`;
            });
    }
}