export class PatientChartSectionInfo {

    constructor(patientChartTree: any, patientChartSection: any,
        patientId: string, admissionId: string, isSignedOff: boolean,
        appointmentId: string, companyId: string) {
        this.patientChartTree = patientChartTree;
        this.patientChartSection = patientChartSection;
        this.patientId = patientId;
        this.admissionId = admissionId;
        this.isSignedOff = isSignedOff;
        this.appointmentId = appointmentId;
        this.companyId = companyId;
    }

    patientChartTree: any;
    patientChartSection: any;
    patientId: string;
    admissionId: string;
    isSignedOff: boolean;
    appointmentId: string;
    companyId: string;
}