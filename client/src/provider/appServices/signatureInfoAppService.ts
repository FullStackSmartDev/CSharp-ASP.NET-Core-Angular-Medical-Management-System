import { Injectable } from "@angular/core";
import { SignatureInfoDataService, EmployeeDataService, AppointmentDataService } from "../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { SignatureInfo } from "../../dataModels/signatureInfo";
import { DateHelper } from "../../helpers/dateHelpers";
import { AuthorizationService } from "../authorizationService";
import { Employee } from "../../dataModels/employee";

@Injectable()
export class SignatureInfoAppService {
    constructor(private signatureInfoDataService: SignatureInfoDataService,
        private employeeDataService: EmployeeDataService,
        private authorizationService: AuthorizationService,
        private appointmentDataService: AppointmentDataService) {

    }

    signOffPatientAdmission(admission: any): Promise<SignatureInfo> {
        const signatureInfo = new SignatureInfo();

        const signDate = new Date();
        signatureInfo.SignDate = signDate;
        signatureInfo.AdmissionId = admission.Id;

        return this.appointmentDataService.getById(admission.AppointmentId)
            .then(appointment => {
                signatureInfo.EmployeeId = appointment.PhysicianId;
                signatureInfo.convertToEntityModel();

                return this.signatureInfoDataService.create(signatureInfo)
            });

        // return this.getCurrentEmployee()
        //     .then(employee => {
        //         signatureInfo.EmployeeId = employee.Id;
        //         signatureInfo.convertToEntityModel();

        //         return this.signatureInfoDataService.create(signatureInfo)
        //     });
    }

    isAdmissionSignedOff(admissionId: string): Promise<boolean> {
        const loadOptions = this.getSignatureInfoLoadOptions(admissionId);

        return this.signatureInfoDataService
            .firstOrDefault(loadOptions)
            .then(signatureInfo => {
                return this.admissionSignedOff(signatureInfo);
            })
    }

    getSignatureString(admissionId: string): Promise<string> {
        const loadOptions = this.getSignatureInfoLoadOptions(admissionId);

        return this.signatureInfoDataService
            .firstOrDefault(loadOptions)
            .then(signatureInfo => {
                if (!this.admissionSignedOff(signatureInfo)) {
                    return "";
                }

                const signDate = DateHelper
                    .getFullDate(signatureInfo.SignDate);

                return this.employeeDataService.getById(signatureInfo.EmployeeId)
                    .then(employee => {
                        const isNamePrefixOrSuffixSet = !!(employee.NamePrefix || employee.NameSuffix);


                        const namePrefix = employee.NamePrefix
                            ? `&nbsp;${employee.NamePrefix}&nbsp;`
                            : isNamePrefixOrSuffixSet
                                ? "&nbsp;"
                                : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                        const nameSuffix = employee.NameSuffix
                            ? `&nbsp;${employee.NameSuffix}&nbsp;`
                            : isNamePrefixOrSuffixSet
                                ? "&nbsp;"
                                : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                        return `<span>Electronically signed by${namePrefix}${employee.FirstName} ${employee.LastName}${nameSuffix}${signDate}</span>`;
                    });

                // return this.getCurrentEmployee()
                //     .then(employee => {
                //         return `<span>Electronically signed by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${employee.FirstName} ${employee.LastName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${signDate}</span>`;
                //     });
            })
    }

    private admissionSignedOff(signatureInfo: SignatureInfo): boolean {
        return !!(signatureInfo && !signatureInfo.IsUnsigned);
    }

    private getSignatureInfoLoadOptions(admissionId: string): any {
        return {
            filter: ["AdmissionId", "=", admissionId]
        }
    }

    // private getCurrentEmployee(): Promise<Employee> {
    //     const currentUser = this.authorizationService.currentUser;

    //     if (currentUser.IsSuperAdmin) {
    //         //todo: provide ui for mapping super user to employee
    //         const employeeId = "44e5bda0-1769-1494-1b28-49b90978a0f3";
    //         return this.employeeDataService.getById(employeeId);;
    //     }

    //     const currentUserId = currentUser.Id;

    //     const loadOptions = {
    //         filter: ["AppUserId", "=", currentUserId]
    //     }

    //     return this.employeeDataService.firstOrDefault(loadOptions);
    // }
}