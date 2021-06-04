import { VitalSignsService } from '../../patient-chart-tree/services/vital-signs.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { BaseVitalSignsService } from '../../patient-chart-tree/services/base-vital-signs.service';
import { MedicalCalculationHelper } from 'src/app/_helpers/medical-calculation.helper';
import { IReportContentProvider, PatientChartNodeReportInfo } from './baseHistoryReportSection';
import { VisionVitalSignsService } from '../../patient-chart-tree/services/vision-vital-signs.service';

export class VitalSignsSection implements IReportContentProvider {
    private emptyValue: string = "-//-";

    constructor(private vitalSignsService: VitalSignsService,
        private baseVitalSignsService: BaseVitalSignsService,
        private visionVitalsignsService: VisionVitalSignsService) {
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        const { admissionId, patientId } =
            patientChartNodeReportInfo;

        const baseVitalSignsHtmlStringPromise = this.getBaseVitalSignsHtmlString(patientId);
        const vitalSignsHtmlStringPromise = this.getVitalSignsHtmlString(admissionId, patientId);
        const visionVitalSignsHtmlStringPromise = this.getVisionVitalSignsHtmlString(patientId);

        return Promise.all([
            baseVitalSignsHtmlStringPromise,
            vitalSignsHtmlStringPromise,
            visionVitalSignsHtmlStringPromise
        ])
            .then(result => {
                const baseVitalSignsHtmlString = result[0];
                const vitalSignsHtmlString = result[1];
                const visionVitalSignsHtmlString = result[2];

                const vitalSignsHeader = "<div style=\"margin-top:10px;\"><b>Vital Signs:</b></div>"

                return `${vitalSignsHeader}${baseVitalSignsHtmlString}${vitalSignsHtmlString}${visionVitalSignsHtmlString}`
            });
    }

    private getVisionVitalSignsHtmlString(patientId: string): Promise<string> {
        return this.visionVitalsignsService
            .getByPatientId(patientId)
            .then(visionVitalsigns => {
                if (!visionVitalsigns.length) {
                    return "";
                }

                let visionVitalSignsString = `
                    <div style="margin-top:15px;overflow:hidden">
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>Date</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>OS</b></div>
                        <div style="line-height:1.2em;float:left;width:20%;text-align:left;"><b>OD</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>OU</b></div>
                        <div style="line-height:1.2em;float:left;width:10%;text-align:left;"><b>With Glasses</b></div>
                    </div>`;

                for (let i = 0; i < visionVitalsigns.length; i++) {
                    const visionVitalsignsItem = visionVitalsigns[i];

                    const date =
                        DateHelper.getDate(visionVitalsignsItem.createDate);

                    const os = visionVitalsignsItem.os
                        ? visionVitalsignsItem.os
                        : this.emptyValue;

                    const od = visionVitalsignsItem.od
                        ? visionVitalsignsItem.od
                        : this.emptyValue;

                    const ou = visionVitalsignsItem.ou
                        ? visionVitalsignsItem.ou
                        : this.emptyValue;

                    visionVitalSignsString += `
                        <div style="margin-top:5px;overflow:hidden">
                            <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${date}</div>
                            <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${os}</div>
                            <div style="line-height:1.2em;float:left;width:20%;text-align:left;">${od}</div>
                            <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${ou}</div>
                            <div style="line-height:1.2em;float:left;width:10%;text-align:left;">${visionVitalsignsItem.withGlasses}</div>
                        </div>`
                }

                return visionVitalSignsString;
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

                for (let i = 0; i < vitalSigns.length; i++) {
                    const vitalSignsItem = vitalSigns[i];

                    const time = DateHelper.getTime(vitalSignsItem.createDate);
                    const pulse = vitalSignsItem.pulse ? vitalSignsItem.pulse : this.emptyValue;

                    const systolicBloodPressure = vitalSignsItem.systolicBloodPressure
                        ? vitalSignsItem.systolicBloodPressure
                        : this.emptyValue;

                    const diastolicBloodPressure = vitalSignsItem.diastolicBloodPressure
                        ? vitalSignsItem.diastolicBloodPressure
                        : this.emptyValue;

                    const bp = `${systolicBloodPressure} / ${diastolicBloodPressure}`;

                    const respiration = vitalSignsItem.respirationRate
                        ? vitalSignsItem.respirationRate
                        : this.emptyValue;

                    const O2Sat = vitalSignsItem.oxygenSaturationAtRestValue
                        ? vitalSignsItem.oxygenSaturationAtRestValue
                        : this.emptyValue;

                    const activity = vitalSignsItem.oxygenSaturationAtRest
                        ? vitalSignsItem.oxygenSaturationAtRest
                        : this.emptyValue;

                    const bloodPressurePosition = vitalSignsItem.bloodPressurePosition
                        ? vitalSignsItem.bloodPressurePosition
                        : this.emptyValue;

                    const bloodPressureLocation = vitalSignsItem.bloodPressureLocation
                        ? vitalSignsItem.bloodPressureLocation
                        : this.emptyValue;

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

                const weight = baseVitalSigns.weight;
                const height = baseVitalSigns.height;

                const bmi = MedicalCalculationHelper.calculateBmi(height, weight);

                const dominantHand = baseVitalSigns.dominantHand;
                const oxygen = baseVitalSigns.oxygenUse || baseVitalSigns.oxygenAmount
                    ? baseVitalSigns.oxygenAmount + ' / ' + baseVitalSigns.oxygenUse
                    : this.emptyValue

                const baseValues = `
                    <div style="margin-top:15px;overflow:hidden">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Weight, lbs</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Height, inches</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>BMI, %</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Dominant Hand</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Oxygen</b></div>
                    </div>
                    <div style="overflow:hidden;margin-top:5px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${weight ? weight : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${height ? height : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${bmi ? bmi : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${dominantHand ? dominantHand : this.emptyValue}</div>
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
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightCalf ? baseVitalSigns.rightCalf : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightThigh ? baseVitalSigns.rightThigh : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightForearm ? baseVitalSigns.rightForearm : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.rightBicep ? baseVitalSigns.rightBicep : this.emptyValue}</div>
                    </div>
                    <div style="overflow:hidden;margin-top:5px;">
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;"><b>Left</b></div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftCalf ? baseVitalSigns.leftCalf : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftThigh ? baseVitalSigns.leftThigh : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftForearm ? baseVitalSigns.leftForearm : this.emptyValue}</div>
                        <div style="line-height:1.2em;float:left;width:15%;text-align:left;">${baseVitalSigns.leftBicep ? baseVitalSigns.leftBicep : this.emptyValue}</div>
                    </div>`

                return `${baseValues}${rightLeftValues}`;
            });
    }
}