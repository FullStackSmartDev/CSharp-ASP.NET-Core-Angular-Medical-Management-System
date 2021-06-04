import { PatientService } from 'src/app/_services/patient.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { PatientInsuranceService } from 'src/app/_services/patient-insurance.service';
import { CompanyService } from 'src/app/_services/company.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import * as moment from 'moment';
import { StateList } from 'src/app/_classes/stateList';
import { Patient } from 'src/app/patients/models/patient';
import { Company } from 'src/app/_models/company';
import { AppointmentGridItem } from 'src/app/scheduler/models/appointmentGridItem';
import { Injectable } from '@angular/core';
import { Admission } from '../models/admission';
import { ConfigService } from 'src/app/_services/config.service';

@Injectable()
export class PatientChartReportHeaderService {
    constructor(private patientService: PatientService,
        private patientInsuranceService: PatientInsuranceService,
        private companyService: CompanyService,
        private appointmentService: AppointmentService,
        private configService: ConfigService) {
    }

    getPatientChartNodeReportContent(admission: Admission,
        companyId: string, isOutsideRichTextEditor: boolean = false): Promise<string> {
        const { patientId, appointmentId } = admission;

        const patientPromise = this.patientService.getById(patientId);
        const patientInsurancePromise = this.patientInsuranceService.getByPatientId(patientId);

        const companyPromise = this.companyService.getById(companyId);

        const appointmentGridViewPromise = this.appointmentService
            .getAppointmentGridItemById(appointmentId);

        const promises: [Promise<Patient>, Promise<any>, Promise<Company>, Promise<AppointmentGridItem>] = [
            patientPromise,
            patientInsurancePromise,
            companyPromise,
            appointmentGridViewPromise
        ]

        return Promise.all(promises)
            .then(result => {
                const emptyValue = "-//-";

                const [patient, patientInsurance, company, appointmentGridView] = result;

                const patientName = `${patient.firstName} ${patient.lastName}`;
                const patientDoB = moment(patient.dateOfBirth).format("LL");
                const patientAge = DateHelper.getAge(patient.dateOfBirth);

                const companyState = StateList.values
                    .filter(s => s.value === company.state)[0].name;

                const admissionDate = moment(appointmentGridView.startDate).format("LL");

                const logoUrl = isOutsideRichTextEditor
                    ? "./patient-chart/imgs/logo.jpg"
                    : this.configService.baseUrl
                        ? `${this.configService.baseUrl}patient-chart/imgs/logo.jpg`
                        : "./imgs/logo.jpg";

                return `
                    <div style="overflow:hidden">
                        <div style="float:right;width:33.3%;text-align:right;">
                            <img src="${logoUrl}">
                        </div>
                    </div>
                    <div style="overflow:hidden;margin-top:10px;">
                        <div style="line-height:1.1em;color:grey;font-size:0.8em;font-weight:bold;float:right;width:33.3%;text-align:right;">
                            <span>${company.address} - ${company.secondaryAddress}</span><br/>
                            <span>${company.city} - ${companyState} - 85012</span><br/>
                            <span>Office ${company.phone}</span><br/>
                            <span>Fax ${company.fax} - 866 264 4120</span><br/>
                        </div>
                    </div>
                    <div style="color:grey;margin-top:20px;" style="overflow:hidden">
                        <h1>History and Physical</h1>
                        <hr/>
                    </div>
                    <div style="margin-top:10px;">
                        <div style="overflow:hidden">
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Claimant's Name:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patientName}</i></div>
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Date of Exam:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${admissionDate}</i></div>
                        </div>
                        <div style="overflow:hidden">
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Date Of Birth / Age:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patientDoB} / ${patientAge} Y</i></div>
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">RQID:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patientInsurance && patientInsurance.rqId ? patientInsurance.rqId : emptyValue}</i></div>
                        </div>
                        <div style="overflow:hidden">
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Case Number:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patientInsurance && patientInsurance.caseNumber ? patientInsurance.caseNumber : emptyValue}</i></div>
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Consultative Examiner:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${appointmentGridView.physicianFirstName} ${appointmentGridView.physicianLastName}</i></div>
                        </div>
                        <div style="overflow:hidden">
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Social Security:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patient && patient.ssn ? patient.ssn : emptyValue}</i></div>
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Location of Exam:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${appointmentGridView.locationName}</i></div>
                        </div>
                    </div>`;
            });
    }
}