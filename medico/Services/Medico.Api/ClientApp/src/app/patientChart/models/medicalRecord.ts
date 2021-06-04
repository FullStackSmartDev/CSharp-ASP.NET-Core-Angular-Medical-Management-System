export class MedicalRecord {
    id: string;
    notes: string;
    patientId: string;
    documentType: string;
    createDate: any;
    includeNotesInReport: boolean;

    constructor() {
        this.createDate = new Date();
        this.includeNotesInReport = true;
    }
}