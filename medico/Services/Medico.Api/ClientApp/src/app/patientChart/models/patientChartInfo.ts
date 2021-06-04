import { PatientChartNode } from 'src/app/_models/patientChartNode';

export class PatientChartInfo {
    constructor(patientChartDocuemntNode: PatientChartNode,
        patientChartNode : PatientChartNode,
        patientId: string, admissionId: string, isSignedOff: boolean,
        appointmentId: string, companyId: string) {

        this.patientChartDocuemntNode = patientChartDocuemntNode;
        this.patientChartNode = patientChartNode;
        this.patientId = patientId;
        this.admissionId = admissionId;
        this.isSignedOff = isSignedOff;
        this.appointmentId = appointmentId;
        this.companyId = companyId;
    }

    patientChartDocuemntNode: PatientChartNode;
    patientChartNode: PatientChartNode;
    patientId: string;
    admissionId: string;
    isSignedOff: boolean;
    appointmentId: string;
    companyId: string;
}