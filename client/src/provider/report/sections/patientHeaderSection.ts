import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { PatientDemographicDataService, PatientInsuranceDataService, CompanyDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { CompanyIdService } from "../../companyIdService";
import { AppointmentGridViewDataService } from "../../dataServices/read/readDataServices";
import * as moment from 'moment';
import { DateHelper } from "../../../helpers/dateHelpers";
import { LookupTables } from "../../../enums/lookupTables";

export class PatientHeaderSection implements IReportSection {
    constructor(private patientDemographicDataService: PatientDemographicDataService,
        private patientInsuranceDataService: PatientInsuranceDataService,
        private companyIdService: CompanyIdService,
        private companyDataService: CompanyDataService,
        private appointmentGridViewDataService: AppointmentGridViewDataService) {

    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientId = reportSectionInfo.admission.PatientDemographicId;
        const appointmentId = reportSectionInfo.admission.AppointmentId;
        const patientPromise = this.patientDemographicDataService
            .getById(patientId);

        const insuranceLoadOptions = {
            filter: ["PatientDemographicId", "=", patientId]
        };
        const patientInsurancePromise = this.patientInsuranceDataService
            .firstOrDefault(insuranceLoadOptions);

        const companyId = this.companyIdService.companyId;
        const companyPromise = this.companyDataService
            .getById(companyId);

        const loadOptions = {
            filter: ["Id", "=", appointmentId]
        }
        const appointmentGridViewPromise = this.appointmentGridViewDataService
            .firstOrDefault(loadOptions);

        const promises = [
            patientPromise,
            patientInsurancePromise,
            companyPromise,
            appointmentGridViewPromise
        ]

        return Promise.all(promises)
            .then(result => {
                const emptyValue = "-//-";

                const patient = result[0];
                const patientInsurance = result[1];
                const patientName = `${patient.FirstName} ${patient.LastName}`;
                const patientDoB = moment(patient.DateOfBirth).format("LL");
                const patientAge = DateHelper.getAge(patient.DateOfBirth);

                const company = result[2];
                const companyState = LookupTables.state
                    .filter(s => s.Value === company.State)[0].Name;

                const appointmentGridView = result[3];
                const admissionDate = moment(appointmentGridView.StartDate).format("LL");

                return `
                    <div style="overflow:hidden">
                        <div style="float:right;width:33.3%;text-align:right;">
                            <img style="background: url('./assets/imgs/logo.png');width:100%;height:100px;">
                        </div>
                    </div>
                    <div style="overflow:hidden;margin-top:10px;">
                        <div style="line-height:1.1em;color:grey;font-size:0.8em;font-weight:bold;float:right;width:33.3%;text-align:right;">
                            <span>${company.Address} - ${company.SecondaryAddress}</span><br/>
                            <span>${company.City} - ${companyState} - 85012</span><br/>
                            <span>Office ${company.Phone}</span><br/>
                            <span>Fax ${company.Fax} - 866 264 4120</span><br/>
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
                            <div style="float:left;width:25%;text-align:left;"><i>${patientInsurance && patientInsurance.RqId ? patientInsurance.RqId : emptyValue}</i></div>
                        </div>
                        <div style="overflow:hidden">
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Case Number:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patientInsurance && patientInsurance.CaseNumber ? patientInsurance.CaseNumber : emptyValue}</i></div>
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Consultative Eximaner:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${appointmentGridView.PhysicianFirstName} ${appointmentGridView.PhysicianLastName}</i></div>
                        </div>
                        <div style="overflow:hidden">
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Social Security:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${patient && patient.Ssn ? patient.Ssn : emptyValue}</i></div>
                            <div style="font-weight:bold;float:left;width:25%;text-align:left;">Location of Exam:</div>
                            <div style="float:left;width:25%;text-align:left;"><i>${appointmentGridView.LocationName}</i></div>
                        </div>
                    </div>`;
            });
    }
}