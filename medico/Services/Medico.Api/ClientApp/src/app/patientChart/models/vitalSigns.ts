export class VitalSigns {
    id: string;
    admissionId: string;
    patientId: string;
    pulse: number;
    systolicBloodPressure: number;
    diastolicBloodPressure: number;
    bloodPressureLocation: string;
    bloodPressurePosition: string;
    oxygenSaturationAtRest: string;
    oxygenSaturationAtRestValue: number;
    respirationRate: number;
    createDate: any;

    constructor() {
        this.createDate = new Date();    
    }
}