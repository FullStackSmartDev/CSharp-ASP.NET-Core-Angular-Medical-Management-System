export class PatientChartHeaderData {
    patientId: string;
    admissionId: string;
    dateOfService: any;

    constructor(patientId: string, admissionId: string, dateOfService: any) {
        this.patientId = patientId;
        this.admissionId = admissionId;
        this.dateOfService = dateOfService;
    }
}