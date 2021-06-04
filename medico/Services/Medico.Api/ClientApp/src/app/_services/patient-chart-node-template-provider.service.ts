export class PatientChartNodeTemplateProviderService {
    static getTemplateValueForPatientChartTemplateNode(templateId: string,
        templateNodeTypeName: string): string {
        return `<patient-chart-template [admissionId]='admissionId' [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' [templateType]='${templateNodeTypeName}' [templateId]='"${templateId}"' [patientChartDocumentNode]='patientChartDocumentNode'></patient-chart-template>`
    }

    static getTemplateValueForPatientChartTemplateListNode(templateTypeName: string): string {
        return `<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartNode]='patientChartNode' templateType='${templateTypeName}'></template-list>`;
    }

    static getTemplateValueForPatientChartScanDocumentNode(pageNumber: number): string {
        return `<scan-document [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId' [appointmentId]='appointmentId' [pageNum]='${pageNumber}'></scan-document>`;
    }
}