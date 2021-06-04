import { IReportSection, ReportSectionInfo } from './baseHistoryReportSection';
import { PatientService } from 'src/app/_services/patient.service';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { PatientInsuranceService } from 'src/app/_services/patient-insurance.service';
import { CompanyService } from 'src/app/_services/company.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import * as moment from 'moment';
import { StateList } from 'src/app/_classes/stateList';

export class PatientHeaderSection implements IReportSection {
    constructor(private patientService: PatientService,
        private patientInsuranceService: PatientInsuranceService,
        private companyIdService: CompanyIdService,
        private companyService: CompanyService,
        private appointmentService: AppointmentService) {

    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientId = reportSectionInfo.admission.patientId;
        const appointmentId = reportSectionInfo.admission.appointmentId;
        const patientPromise = this.patientService.getById(patientId);

        const patientInsurancePromise = this.patientInsuranceService.getByPatientId(patientId);

        const companyId = this.companyIdService.companyIdValue;
        const companyPromise = this.companyService.getById(companyId);

        const appointmentGridViewPromise = this.appointmentService
            .getAppointmentGridItemById(appointmentId);

        const promises = [
            patientPromise,
            patientInsurancePromise,
            companyPromise,
            appointmentGridViewPromise
        ]

        return Promise.all([patientPromise, patientInsurancePromise, companyPromise, appointmentGridViewPromise])
            .then(result => {
                const emptyValue = "-//-";

                const patient = result[0];
                const patientInsurance = result[1];
                const patientName = `${patient.firstName} ${patient.lastName}`;
                const patientDoB = moment(patient.dateOfBirth).format("LL");
                const patientAge = DateHelper.getAge(patient.dateOfBirth);

                const company = result[2];
                const companyState = StateList.values
                    .filter(s => s.value === company.state)[0].name;

                const appointmentGridView = result[3];
                const admissionDate = moment(appointmentGridView.startDate).format("LL");

                return `
                    <div style="overflow:hidden">
                        <div style="float:right;width:33.3%;text-align:right;">
                            <img style="background: url('./assets/imgs/logo.png');width:100%;height:100px;">
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
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Consultative Eximaner:</div>
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