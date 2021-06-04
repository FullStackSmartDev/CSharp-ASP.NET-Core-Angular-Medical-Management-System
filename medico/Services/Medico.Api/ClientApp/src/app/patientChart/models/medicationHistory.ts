export class MedicationHistory {
    id: string;
    createDate: any;
    medication: string;
    patientId: string;
    medicationNameId: string;
    units: string;
    dose: string;
    route: string;
    prn: boolean;
    medicationStatus: string;
    notes: string;
    dosageForm: string;
    sig: string;

    constructor(patientId: string = "") {
        this.createDate = new Date();
        this.prn = false;
        this.patientId = patientId;
    }
}