export class MedicationHistory {
    id: string;
    createDate: any;
    medication: string;
    patientId: string;
    medicationNameId: string;
    string: number;
    units: string;
    dose: string;
    route: string;
    prn: boolean;
    medicationStatus: string;
    notes: string;
    dosageForm: string;

    constructor(patientId: string = "") {
        this.createDate = new Date();
        this.prn = false;
        this.patientId = patientId;
    }
}