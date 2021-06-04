export class Document {
    id: string;
    patientId: string;
    documentData: string;
    createDate: any;

    constructor() {
        this.createDate = new Date();    
    }
}