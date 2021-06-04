import { ZipCodeType } from '../patients/models/zipCodeType';

export class Company {
    id: string;
    name: string;
    address: string;
    secondaryAddress: string;
    city: string;
    state: number;
    zipCode: string;
    zipCodeType: ZipCodeType;
    phone: string;
    fax: string;
    webSiteUrl: string;
    isActive: boolean;

    constructor() {
        this.isActive = true;        
    }
}