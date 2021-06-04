import { Injectable } from '@angular/core';
import { TemplateService } from 'src/app/_services/template.service';
import { ArrayHelper } from 'src/app/_helpers/array.helper';
import { PredefinedTemplateTypeNames } from 'src/app/_classes/predefinedTemplateTypeNames';
import { TemplateWithTypeName } from 'src/app/_models/templateWithTypeName';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Admission } from '../models/admission';
import { AdmissionService } from './admission.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { ReportSectionNames } from '../classes/reportSectionNames';
import { Template } from 'src/app/_models/template';
import { CompanyService } from 'src/app/_services/company.service';
import { Appointment } from 'src/app/_models/appointment';
import { PatientDataModelNode } from '../classes/patientDataModelNode';
import { PatientChartTreeItem } from 'src/app/administration/classes/patientChartTreeItem';
import { PatientChartTreeItemType } from 'src/app/administration/classes/patientChartTreeItemType';
import { TemplateType } from 'src/app/administration/models/templateType';

@Injectable()
export class PatientChartService {
    patientChartTree: any;
    patientChartTreeProjection: any;
    patientId: string;
    patientScanDocumentData: any;

    constructor(private companyService: CompanyService,
        private templateService: TemplateService,
        private admissionService: AdmissionService) { }

    getPatientAdmission(appointment: Appointment): Promise<Admission> {
        this.patientId = appointment.patientId;

        const companyId = appointment.companyId;
        const admissionId = appointment.admissionId;
        const appointmentId = appointment.id;

        const patientChartConfigPromise = this.companyService.getPatientChartConfig(companyId);
        const requiredTemplatesPromise = this.templateService.getRequiredTemplates(companyId);

        return Promise.all([patientChartConfigPromise, requiredTemplatesPromise])
            .then(result => {
                const patientChartConfig = result[0];
                const requiredTemplates = result[1];

                const isNewAdmission = !admissionId;

                if (isNewAdmission) {
                    return this.setDefaultContentToTemplatesSections(patientChartConfig, companyId)
                        .then(() => {
                            if (requiredTemplates.length)
                                this.addRequiredTemplatesToPatientChartTree(patientChartConfig.patientRoot, requiredTemplates, companyId);

                            const newAdmission = new Admission();
                            newAdmission.createdDate = new Date();
                            newAdmission.patientId = this.patientId;
                            newAdmission.appointmentId = appointmentId;
                            newAdmission.admissionData = JSON.stringify(patientChartConfig);
                            return this.admissionService.save(newAdmission);
                        })
                }

                return this.admissionService.getById(admissionId);
            });
    }

    getPatientChartSectionByName(name: string, patientChartTreeSection: any): any {
        if (!patientChartTreeSection)
            throw "Patient chart tree section is required";

        if (patientChartTreeSection.name === name)
            return patientChartTreeSection;

        if (patientChartTreeSection.children && patientChartTreeSection.children.length > 0) {
            for (let i = 0; i < patientChartTreeSection.children.length; i++) {
                let childrenSection = patientChartTreeSection.children[i];
                let patientChartSection = this.getPatientChartSectionByName(name, childrenSection);

                if (patientChartSection)
                    return patientChartSection;
            }
        }
    }

    getPatientChartAdminTree(patientChartTreeRootItem: any, options?: any): PatientChartTreeItem {
        const id = patientChartTreeRootItem.id;
        const text = patientChartTreeRootItem.title;
        const name = patientChartTreeRootItem.name;

        const expanded = options && options.expandedSectionId === id
            ? true : false;

        const itemType = patientChartTreeRootItem.type;
        const isPredefined = patientChartTreeRootItem.isPredefined;
        const parentPatientChartTreeItemId = patientChartTreeRootItem.parentId;

        let patientChartTreeItem =
            new PatientChartTreeItem(id, text, name,
                expanded, itemType, isPredefined, parentPatientChartTreeItemId);

        let itemChildren = patientChartTreeRootItem.children;
        if (!itemChildren || itemChildren.length === 0)
            return patientChartTreeItem;

        for (let i = 0; i < itemChildren.length; i++) {
            let child = itemChildren[i];
            patientChartTreeItem.items[i] = this.getPatientChartAdminTree(child, options);
        }

        return patientChartTreeItem;
    }

    getPatientChartTreeProjection(patientChartTreeSection: any, isSignedOff: boolean) {
        let visible = true;

        const signedOffOnly = patientChartTreeSection
            .attributes.signedOffOnly;

        if (signedOffOnly && !isSignedOff) {
            visible = false;
        }

        const id = patientChartTreeSection.id;
        const text = patientChartTreeSection.title;
        const name = patientChartTreeSection.name;
        const checked = false;
        const expanded = false;
        const isRequired = patientChartTreeSection.isRequired;
        const isNotVisibleInReport = patientChartTreeSection
            && patientChartTreeSection.attributes && patientChartTreeSection.attributes.isNotVisibleInReport;

        let projectionTreeNode =
            new PatientDataModelNode(id, text, name, expanded, visible, isNotVisibleInReport, checked, isRequired)

        if (patientChartTreeSection.templateViewModel && patientChartTreeSection.templateViewModel.templateName) {
            projectionTreeNode.templateName =
                patientChartTreeSection.templateViewModel.templateName;
        }

        let nodeChildrens = patientChartTreeSection.children;
        if (!nodeChildrens || nodeChildrens.length === 0)
            return projectionTreeNode;

        for (let i = 0; i < nodeChildrens.length; i++) {
            let child = nodeChildrens[i];
            projectionTreeNode.items[i] = this.getPatientChartTreeProjection(child, isSignedOff);
        }

        return projectionTreeNode;
    }

    createPatientChartSection(parentSectionId: string, sectionName: string,
        sectionTitle: string, attributes: any, sectionId: string = "", template: string = "") {
        return {
            id: sectionId ? sectionId : GuidHelper.generateNewGuid(),
            name: sectionName,
            title: sectionTitle,
            parentId: parentSectionId,
            value: {},
            attributes: attributes,
            template: template,
            children: [],
            type: PatientChartTreeItemType.Section
        }
    }

    updatePatientChartTemplateSection(templateSection: any, templateType: string, template: Template,
        attributes: any) {
        const templateName = template.name;

        templateSection.name = templateName;
        templateSection.title = template.reportTitle;

        templateSection.attributes = attributes;

        templateSection.value = {
            defaultTemplateHtml: template.defaultTemplateHtml,
            detailedTemplateHtml: template.initialDetailedTemplateHtml,
            isDetailedTemplateUsed: !template.defaultTemplateHtml
        };

        templateSection.templateViewModel = {
            templateType: templateType,
            templateName: templateName
        };
    }

    createPatientChartTemplateListSection(parentSectionId: string, templateType: TemplateType, attributes: any): any {
        const templateTypeName = templateType.name;
        return {
            id: GuidHelper.generateNewGuid(),
            name: templateTypeName,
            title: templateType.title,
            value: [],
            type: PatientChartTreeItemType.TemplateList,
            attributes: attributes,
            template: `<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartSection]='patientChartSection' templateType='${templateTypeName}'></template-list>`,
            parentId: parentSectionId
        }
    }

    updatePatientChartTemplateListSection(templateListSection: any, templateType: TemplateType, attributes: any): any {
        const templateTypeName = templateType.name;

        templateListSection.name = templateTypeName;
        templateListSection.title = templateType.title;

        templateListSection.value = [];

        templateListSection.attributes = attributes;
        templateListSection.template = `<template-list [companyId]='companyId' [isSignedOff]='isSignedOff' [patientChartSection]='patientChartSection' templateType='${templateTypeName}'></template-list>`;
    }

    createPatientChartTemplateSection(parentSectionId: string, templateType: string, template: Template,
        attributes: any, templateSectionId: string = ""): any {
        const templateName = template.name;
        return {
            id: templateSectionId ? templateSectionId : GuidHelper.generateNewGuid(),
            name: templateName,
            title: template.reportTitle,
            parentId: parentSectionId,
            template: "<patient-chart-template [companyId]='companyId' [isSignedOff]='isSignedOff' [admissionId]='admissionId' [patientId]='patientId' [patientChartTree]='patientChartTree' [templateType]='templateType' [templateName]='templateName' [patientChartSectionValue]='patientChartSectionValue'></patient-chart-template>",
            templateViewModel: { templateType: templateType, templateName: templateName },
            value: {
                defaultTemplateHtml: template.defaultTemplateHtml,
                detailedTemplateHtml: template.initialDetailedTemplateHtml,
                isDetailedTemplateUsed: !template.defaultTemplateHtml
            },
            attributes: attributes,
            type: PatientChartTreeItemType.Template
        }
    }

    getPatientChartSectionById(id: string, patientChartTreeSection: any): any {
        if (!patientChartTreeSection)
            throw "Invalid section";

        if (patientChartTreeSection.id === id)
            return patientChartTreeSection;

        if (patientChartTreeSection.children && patientChartTreeSection.children.length > 0) {
            for (let i = 0; i < patientChartTreeSection.children.length; i++) {
                let childrenSection = patientChartTreeSection.children[i];
                let patientChartSection = this.getPatientChartSectionById(id, childrenSection);

                if (patientChartSection)
                    return patientChartSection;
            }
        }
    }

    deleteSectionFromPatientChart(sectionId: string, parentSectionId: string, patientChartTree: any) {
        const parentSection =
            this.getPatientChartSectionById(parentSectionId, patientChartTree.patientRoot);

        const parentSectionChildren =
            parentSection.children;

        const sectionIndex = parentSectionChildren
            .findIndex(section => section.id === sectionId);

        parentSectionChildren.splice(sectionIndex, 1);
    }

    private setDefaultContentToTemplatesSections(patientChartTree: any, companyId: string): Promise<void> {
        const templatesSections = this.getPatientChartTemplatesSections(patientChartTree.patientRoot);
        const templatesSectionsLength = templatesSections.length;

        if (!templatesSectionsLength)
            return Promise.resolve();

        const setDefaultContentToTemplatesSectionsPromises = [];

        for (let i = 0; i < templatesSectionsLength; i++) {
            const templatesSection = templatesSections[i];

            const templateName = templatesSection
                .templateViewModel.templateName;

            const setDefaultContentToTemplateSectionPromise =
                this.templateService.getByName(templateName, companyId)
                    .then(template => {
                        const templateValue = {
                            defaultTemplateHtml: "",
                            detailedTemplateHtml: "",
                            isDetailedTemplateUsed: false
                        }

                        if (template) {
                            templateValue.defaultTemplateHtml = template.defaultTemplateHtml;
                            templateValue.detailedTemplateHtml = template.initialDetailedTemplateHtml;
                            templateValue.isDetailedTemplateUsed = !template.defaultTemplateHtml;
                        }

                        templatesSection.value = templateValue;
                    });

            setDefaultContentToTemplatesSectionsPromises
                .push(setDefaultContentToTemplateSectionPromise);
        }

        return Promise.all(setDefaultContentToTemplatesSectionsPromises).then();
    }

    private getPatientChartTemplatesSections(patientChartSection: any): any[] {
        if (patientChartSection.type && patientChartSection.type === PatientChartTreeItemType.Template)
            return [patientChartSection];

        const children = patientChartSection.children;
        if (!children || !children.length)
            return [];

        let templatesSections = [];

        for (let i = 0; i < children.length; i++) {
            const childrenPatientChartSection = children[i];
            const childrenTemplatesSection =
                this.getPatientChartTemplatesSections(childrenPatientChartSection);

            if (childrenTemplatesSection.length)
                templatesSections = templatesSections.concat(childrenTemplatesSection);
        }

        return templatesSections;
    }

    private addRequiredTemplatesToPatientChartTree(patientChartTreeSection: any,
        requiredTemplates: Template[], companyId: string): any {
        const templatesType = [
            PredefinedTemplateTypeNames.ros,
            PredefinedTemplateTypeNames.physicalExam,
            PredefinedTemplateTypeNames.procedure,
            PredefinedTemplateTypeNames.hpi];

        if (!requiredTemplates && !requiredTemplates.length) {
            return;
        }

        const requiredTemplatesGroupedByType = ArrayHelper.groupBy(requiredTemplates, "templateTypeName");

        for (let i = 0; i < templatesType.length; i++) {
            const templateTypeName = templatesType[i];
            //sections that contains templates have names that is the name
            //of template type that this section contains 
            const section = this.getPatientChartSectionByName(templateTypeName, patientChartTreeSection);
            const requiredTemplatesByType =
                requiredTemplatesGroupedByType[templateTypeName];

            this.addTemplatesToChartSection(section, requiredTemplatesByType);
        }
    }

    public addScanDocumentsToPatientChartTree(patientChartTree: any, scanDocumentsInfos: any) {
        const scanDocumentSection =
            this.getPatientChartSectionByName(ReportSectionNames.scanDocumentSection, patientChartTree.patientRoot);

        if (!scanDocumentSection || scanDocumentsInfos == null) {
            return;
        }

        let patientDocuments = JSON.parse(scanDocumentsInfos.documentData);

        //todo: temporary fix:  exclude null documents
        patientDocuments = patientDocuments.filter((document) => !!document);

        const patientDocumentsGroupedByDateAndType =
            this.getGroupedDocumentByDateAndType(patientDocuments);

        scanDocumentSection.children = [];

        patientDocumentsGroupedByDateAndType.forEach(documentsGroupedByDate => {
            const documentCreateDate = DateHelper.getDate(documentsGroupedByDate.documentCreateDate);
            const parentSectionId = scanDocumentSection.id;

            const groupedByDateSectionId = GuidHelper.generateNewGuid();
            const attributes = {
                isVisible: true
            }

            const groupedByDateSection = this.createPatientChartSection(parentSectionId,
                documentCreateDate, documentCreateDate, attributes, groupedByDateSectionId);

            const documentsGroupedByTypes =
                documentsGroupedByDate.documentsGroupedByTypes;

            for (let documentType in documentsGroupedByTypes) {
                if (documentsGroupedByTypes.hasOwnProperty(documentType)) {

                    const groupedByTypeSection = this.createPatientChartSection(groupedByDateSectionId, documentType,
                        documentType, { isVisible: true });

                    const documents = documentsGroupedByTypes[documentType];

                    for (let i = 0; i < documents.length; i++) {
                        const document = documents[i];
                        const documentName = document.documentName;
                        const pageNumber = document.pageNum;

                        const scanDocumentTemplate =
                            `<scan-document [companyId]='companyId' [isSignedOff]='isSignedOff' [patientId]='patientId' [appointmentId]='appointmentId' [pageNum]='${pageNumber}'></scan-document>`;

                        const scanDocumentSection = this.createPatientChartSection(
                            groupedByTypeSection.id,
                            documentName,
                            documentName,
                            { isVisible: true },
                            "",
                            scanDocumentTemplate
                        );

                        groupedByTypeSection.children.push(scanDocumentSection);
                    }

                    groupedByDateSection.children.push(groupedByTypeSection);
                }
            }

            scanDocumentSection.children.push(groupedByDateSection);
        });
    }

    private getGroupedDocumentByDateAndType(documents) {
        var groupedDocumentsByDate = ArrayHelper.groupBy(documents, 'doucmentDate');
        var result = [];
        for (var documentCreateDate in groupedDocumentsByDate) {
            var documentsGroupedByTypes = ArrayHelper
                .groupBy(groupedDocumentsByDate[documentCreateDate], 'documentType');

            result.push({
                documentCreateDate: documentCreateDate,
                documentsGroupedByTypes: documentsGroupedByTypes
            })
        }
        return result;
    }

    private addTemplatesToChartSection(section: any, templates: Array<TemplateWithTypeName>) {
        if (!section || !templates || !templates.length) {
            return;
        }

        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];

            const parentSectionId = section.id;
            const newlyCreatedSectionId = GuidHelper.generateNewGuid();

            const attributes = {
                order: template.templateOrder,
                isVisible: true
            }

            const templateSection = this.
                createPatientChartTemplateSection(
                    parentSectionId,
                    template.templateTypeName,
                    template,
                    attributes,
                    newlyCreatedSectionId,
                );

            if (!section.children) {
                section.children = [];
            }

            section.children.push(templateSection);

            //also we should add required templates to section "value" property
            section.value.push({
                id: template.id,
                title: template.reportTitle,
                name: template.name,
                order: template.templateOrder,
                sectionId: newlyCreatedSectionId
            });
        }

        section.value.sort(sortTemplateOrderAscFunc);
        section.children.sort(sortSectionChildrenOrderAscFunc);

        function sortTemplateOrderAscFunc(t1, t2) {
            return t1.Order - t2.Order;
        }

        function sortSectionChildrenOrderAscFunc(t1, t2) {
            return t1.attributes.order - t2.attributes.order;
        }
    }
}