export class MedicalRecord {
    id: string;
    notes: string;
    patientId: string;
    documentType: string;
    createDate: any;

    constructor() {
        this.createDate = new Date();   
    }
}