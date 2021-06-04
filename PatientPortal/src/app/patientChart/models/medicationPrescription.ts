import { GuidHelper } from 'src/app/_helpers/guid.helper';
export class MedicationPrescription {
    id: string;
    patientId: string;
    admissionId: string;
    medicationNameId: string;
    medication: string;
    dose: string;
    dosageForm: string;
    route: string;
    units: string;
    dispense: number;
    refills: number;
    sig: string;
    startDate: any;
    endDate: any;

    constructor(patientId: string = "", admissionId: string = "") {
        this.patientId = patientId;
        this.admissionId = admissionId;
        this.startDate = new Date();
    }
}