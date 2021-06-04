import { ReportSectionInfo, IReportSection } from "./baseHistoryReportSection";
import { VitalSignsService } from '../../patient-chart-tree/services/vital-signs.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { BaseVitalSignsService } from '../../patient-chart-tree/services/base-vital-signs.service';
import { MedicalCalculationHelper } from 'src/app/_helpers/medical-calculation.helper';

export class VitalSignsSection implements IReportSection {
    constructor(private vitalSignsService: VitalSignsService, private baseVitalSignsService: BaseVitalSignsService) {
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const admissionId = reportSectionInfo.admission.id;
        const patientId = reportSectionInfo.admission.patientId;

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
        return this.vitalSignsService.getByPatientAndAdmissionIds(patientId, admissionId)
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

                const emptyValue = "-//-";

                for (let i = 0; i < vitalSigns.length; i++) {
                    const vitalSignsItem = vitalSigns[i];

                    const time = DateHelper.getTime(vitalSignsItem.createDate);
                    const pulse = vitalSignsItem.pulse ? vitalSignsItem.pulse : emptyValue;

                    const systolicBloodPressure = vitalSignsItem.systolicBloodPressure
                        ? vitalSignsItem.systolicBloodPressure
                        : emptyValue;

                    const diastolicBloodPressure = vitalSignsItem.diastolicBloodPressure
                        ? vitalSignsItem.diastolicBloodPressure
                        : emptyValue;

                    const bp = `${systolicBloodPressure} / ${diastolicBloodPressure}`;

                    const respiration = vitalSignsItem.respirationRate
                        ? vitalSignsItem.respirationRate
                        : emptyValue;

                    const O2Sat = vitalSignsItem.oxygenSaturationAtRestValue
                        ? vitalSignsItem.oxygenSaturationAtRestValue
                        : emptyValue;

                    const activity = vitalSignsItem.oxygenSaturationAtRest
                        ? vitalSignsItem.oxygenSaturationAtRest
                        : emptyValue;

                    const bloodPressurePosition = vitalSignsItem.bloodPressurePosition
                        ? vitalSignsItem.bloodPressurePosition
                        : emptyValue;

                    const bloodPressureLocation = vitalSignsItem.bloodPressureLocation
                        ? vitalSignsItem.bloodPressureLocation
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
        return this.baseVitalSignsService.getByPatientId(patientId)
            .then(baseVitalSigns => {
                if (!baseVitalSigns)
                    return "";

                const emptyValue = "-//-";

                const weight = baseVitalSigns.weight;
                const height = baseVitalSigns.height;

                const bmi = MedicalCalculationHelper.calculateBmi(height, weight);

                const dominantHand = baseVitalSigns.dominantHand;
                const oxygen = baseVitalSigns.oxygenUse || baseVitalSigns.oxygenAmount
                    ? baseVitalSigns.oxygenAmount + ' / ' + baseVitalSigns.oxygenUse
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
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${ baseVitalSigns.rightCalf ? baseVitalSigns.rightCalf : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightThigh ? baseVitalSigns.rightThigh : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightForearm ? baseVitalSigns.rightForearm : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightBicep ? baseVitalSigns.rightBicep : emptyValue}</div>
                    </div>
                    <div style="overflow:hidden;margin-top:5px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Left</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftCalf ? baseVitalSigns.leftCalf : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftThigh ? baseVitalSigns.leftThigh : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftForearm ? baseVitalSigns.leftForearm : emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftBicep ? baseVitalSigns.leftBicep : emptyValue}</div>
                    </div>`

                return `${baseValues}${rightLeftValues}`;
            });
    }
}