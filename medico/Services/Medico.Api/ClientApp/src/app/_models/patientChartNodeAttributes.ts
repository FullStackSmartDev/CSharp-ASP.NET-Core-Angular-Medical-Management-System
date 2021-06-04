export class PatientChartNodeAttributes {
    order: number;
    isActive: boolean;
    isNotShownInReport: boolean;
    signedOffOnly: boolean;
    isPredefined: boolean;
    nodeSpecificAttributes: any;

    static createPatientChartNodeAttributes(order: number,
        isActive: boolean, isNotShownInReport: boolean,
        signedOffOnly: boolean, isPredefined: boolean, nodeSpecificAttributes: any = null): PatientChartNodeAttributes {
        const patientChartNodeAttributes =
            new PatientChartNodeAttributes();

        patientChartNodeAttributes.order = order;
        patientChartNodeAttributes.isPredefined = isPredefined;
        patientChartNodeAttributes.isActive = isActive;
        patientChartNodeAttributes.isNotShownInReport = isNotShownInReport;
        patientChartNodeAttributes.signedOffOnly = signedOffOnly;

        patientChartNodeAttributes.nodeSpecificAttributes =
            nodeSpecificAttributes || {};

        return patientChartNodeAttributes;
    }
}