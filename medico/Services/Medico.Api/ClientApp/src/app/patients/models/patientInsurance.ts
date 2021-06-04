import { Patient } from './patient';

export class PatientInsurance extends Patient {
    patientId: string;
    caseNumber: string;
    rqId: string;
}