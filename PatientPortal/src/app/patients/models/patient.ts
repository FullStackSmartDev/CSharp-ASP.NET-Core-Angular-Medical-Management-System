import { ZipCodeType } from './zipCodeType';

export class Patient {
    id: string;
    companyId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    gender: number;
    dateOfBirth: any;
    maritalStatus: number;
    ssn: string;
    primaryAddress: string;
    secondaryAddress: string;
    city: string;
    primaryPhone: string;
    secondaryPhone: string;
    email: string;
    zip: string;
    state: number;
    patientInsuranceId: string;
    zipCodeType: ZipCodeType;

    constructor() {
        this.zipCodeType = ZipCodeType.NineDigit;
    }
}