import { ZipCodeType } from 'src/app/patients/models/zipCodeType';

export class MedicoApplicationUser {
    id: string;
    isActive: boolean;
    companyId: string;
    firstName: string;
    namePrefix: string;
    nameSuffix: string;
    middleName: string;
    lastName: string;
    email: string;
    address: string;
    secondaryAddress: string;
    city: string;
    state: number;
    gender: number;
    primaryPhone: string;
    secondaryPhone: string;
    employeeType: number;
    ssn: string;
    dateOfBirth: any;
    password: string;
    passwordCopy: string;
    role: string;
    zip: string;
    zipCodeType: ZipCodeType;

    constructor() {
        this.isActive = true;
        this.zipCodeType = ZipCodeType.FiveDigit;
    }
}