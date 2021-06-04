import { ZipCodeType } from 'src/app/patients/models/zipCodeType';

export class Location {
    id: string;
    companyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    zipCodeType: ZipCodeType;
    fax: string;
    phone: string;
    secondaryAddress: string;
    isActive: boolean;

    constructor() {
        this.isActive = true;    
    }
}