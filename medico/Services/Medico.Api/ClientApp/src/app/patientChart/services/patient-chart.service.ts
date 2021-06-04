import { Injectable } from '@angular/core';
import { TemplateService } from 'src/app/_services/template.service';
import { ArrayHelper } from 'src/app/_helpers/array.helper';
import { PredefinedTemplateTypeNames } from 'src/app/_classes/predefinedTemplateTypeNames';
import { TemplateWithTypeName } from 'src/app/_models/templateWithTypeName';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Admission } from '../models/admission';
import { AdmissionService } from './admission.service';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { Appointment } from 'src/app/_models/appointment';
import { PatientDataModelNode } from '../classes/patientDataModelNode';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeManagementService } from './patient-chart-node-management.service';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import { PatientChartNodeFiltersService } from './patient-chart-node-filters.service';
import { TemplateNodeInfo } from '../models/templateNodeInfo';
import { PatientChartAdminNode } from 'src/app/administration/classes/patientChartAdminNode';
import { PatientChartNodeAttributes } from 'src/app/_models/patientChartNodeAttributes';
import { PatientChartNodeTemplateProviderService } from 'src/app/_services/patient-chart-node-template-provider.service';
import { PatientChartHttpService } from 'src/app/_services/patient-chart-http.service';
import { TemplateGridItem } from 'src/app/_models/templateGridItem';
import { Template } from 'src/app/_models/template';

@Injectable()
export class PatientChartService {
    patientChartTree: any;
    patientChartTreeProjection: any;
    patientId: string;
    patientScanDocumentData: any;

    constructor(private templateService: TemplateService,
        private admissionService: AdmissionService,
        private patientChartNodeManagementService: PatientChartNodeManagementService,
        private patientChartNodeFiltersService: PatientChartNodeFiltersService,
        private patientChartHttpService: PatientChartHttpService) { }

    getPatientAdmission(appointment: Appointment): Promise<Admission> {
        this.patientId = appointment.patientId;

        const { companyId, admissionId, id: appointmentId, patientChartDocumentId } = appointment;

        const requiredTemplatesPromise = this.templateService
            .getRequiredTemplates(companyId);

        const patientChartRootNodePromise =
            this.patientChartHttpService.get(companyId, patientChartDocumentId)

        return Promise.all([patientChartRootNodePromise, requiredTemplatesPromise])
            .then(results => {
                const [patientChartRootNode, requiredTemplates] = results;
                const isNewAdmission = !admissionId;

                const addingRequiredTemplatesNeed =
                    isNewAdmission && requiredTemplates.length;

                if (addingRequiredTemplatesNeed)
                    this.addRequiredTemplatesToTemplateListsNodes(patientChartRootNode, requiredTemplates);

                if (isNewAdmission) {
                    return this.setDefaultContentToTemplatesNodes(patientChartRootNode, companyId)
                        .then(() => {
                            const newAdmission = new Admission();
                            newAdmission.createdDate = new Date();
                            newAdmission.patientId = this.patientId;
                            newAdmission.appointmentId = appointmentId;
                            newAdmission.admissionData = JSON.stringify(patientChartRootNode);
                            return this.admissionService.save(newAdmission);
                        })
                }

                return this.admissionService.getById(admissionId);
            });
    }

    getPatientChartAdminTree(patientChartTreeRootItem: any, options?: any): PatientChartAdminNode {
        const id = patientChartTreeRootItem.id;
        const text = patientChartTreeRootItem.title;
        const name = patientChartTreeRootItem.name;

        const expanded = options && options.expandedSectionId === id
            ? true : false;

        const itemType = patientChartTreeRootItem.type;
        const isPredefined = patientChartTreeRootItem
            .attributes.isPredefined;

        const parentPatientChartTreeItemId = patientChartTreeRootItem.parentId;

        const order = patientChartTreeRootItem.attributes.order;
        const isActive = patientChartTreeRootItem.attributes.isActive;

        const templateId = patientChartTreeRootItem.attributes.nodeSpecificAttributes
            && patientChartTreeRootItem.attributes.nodeSpecificAttributes.templateId;

        let patientChartTreeItem =
            new PatientChartAdminNode(id, text, name,
                expanded, itemType, isPredefined,
                parentPatientChartTreeItemId, order, isActive, templateId);

        let itemChildren = patientChartTreeRootItem.children;
        if (!itemChildren || itemChildren.length === 0)
            return patientChartTreeItem;

        for (let i = 0; i < itemChildren.length; i++) {
            let child = itemChildren[i];
            patientChartTreeItem.items[i] = this.getPatientChartAdminTree(child, options);
        }

        return patientChartTreeItem;
    }

    getPatientChartTreeProjection(patientChartNode: PatientChartNode, isSignedOff: boolean): PatientDataModelNode {
        let visible = true;

        const signedOffOnly = patientChartNode
            .attributes.signedOffOnly;

        const isActive = patientChartNode
            .attributes.isActive;

        if (!isActive || (signedOffOnly && !isSignedOff)) {
            visible = false;
        }

        const id = patientChartNode.id;
        const text = patientChartNode.title;
        const name = patientChartNode.name;
        const expanded = false;
        const isNotShownInReport = patientChartNode
            && patientChartNode.attributes && patientChartNode.attributes.isNotShownInReport;

        let projectionTreeNode =
            new PatientDataModelNode(id, text, name, expanded, visible, isNotShownInReport);

        let nodeChildrens = patientChartNode.children;
        if (!nodeChildrens || nodeChildrens.length === 0)
            return projectionTreeNode;

        for (let i = 0; i < nodeChildrens.length; i++) {
            let child = nodeChildrens[i];
            projectionTreeNode.items[i] = this.getPatientChartTreeProjection(child, isSignedOff);
        }

        return projectionTreeNode;
    }

    private setDefaultContentToTemplatesNodes(patientChartRootNode: PatientChartNode, companyId: string): Promise<void> {
        const templateNodeFilter =
            (patientChartNode: PatientChartNode) => patientChartNode.type === PatientChartNodeType.TemplateNode;

        const patientChartTemplateNodes =
            this.patientChartNodeManagementService
                .getNodes(patientChartRootNode, templateNodeFilter);

        const templateNodesLength =
            patientChartTemplateNodes.length;

        if (!templateNodesLength)
            return Promise.resolve();

        const setDefaultContentToTemplatesSectionsPromises = [];

        for (let i = 0; i < templateNodesLength; i++) {
            const templateNode = patientChartTemplateNodes[i];

            const templateId = templateNode
                .attributes.nodeSpecificAttributes
                .templateId;

            const setDefaultContentToTemplateSectionPromise =
                this.templateService.getById(templateId)
                    .then(template => {
                        this.setTemplateNodeValue(template, templateNode);
                    });

            setDefaultContentToTemplatesSectionsPromises
                .push(setDefaultContentToTemplateSectionPromise);
        }

        return Promise.all(setDefaultContentToTemplatesSectionsPromises).then();
    }

    private addRequiredTemplatesToTemplateListsNodes(patientChartRootNode: PatientChartNode,
        requiredTemplates: TemplateGridItem[]): any {
        const templatesTypesNames = [
            PredefinedTemplateTypeNames.ros,
            PredefinedTemplateTypeNames.physicalExam,
            PredefinedTemplateTypeNames.procedure,
            PredefinedTemplateTypeNames.hpi];

        if (!requiredTemplates && !requiredTemplates.length) {
            return;
        }

        const requiredTemplatesGroupedByType =
            ArrayHelper.groupBy(requiredTemplates, "templateTypeName");

        for (let i = 0; i < templatesTypesNames.length; i++) {
            const templateTypeName = templatesTypesNames[i];

            const nodeNameFilter = this.patientChartNodeFiltersService
                .getByNodeNameFilter(templateTypeName);

            //sections that contains templates have names that is the name
            //of template type that this section contains
            const templateListNodes = this.patientChartNodeManagementService
                .getNodes(patientChartRootNode, nodeNameFilter);

            const requiredTemplatesByType =
                requiredTemplatesGroupedByType[templateTypeName];

            if (!templateListNodes.length)
                return;

            for (let j = 0; j < templateListNodes.length; j++) {
                const templateListNode = templateListNodes[j];
                this.addTemplatesToTemplateListNode(templateListNode, requiredTemplatesByType);
            }
        }
    }

    public addScanDocumentsToPatientChartNodes(patientChartNode: PatientChartNode, scanDocumentsInfo: any) {
        const scanDocumentSectionNodes: PatientChartNode[] =
            this.patientChartNodeManagementService
                .getNodes(patientChartNode, (node: PatientChartNode) => node.type === PatientChartNodeType.ScanDocumentNode);

        const addingScanDocumentsNeeded = scanDocumentSectionNodes.length &&
            scanDocumentsInfo;

        if (!addingScanDocumentsNeeded)
            return;

        scanDocumentSectionNodes
            .forEach(scanDocumentSectionNode =>
                this.addScanDocumentsToPatientChartNode(scanDocumentSectionNode, scanDocumentsInfo));
    }

    private addScanDocumentsToPatientChartNode(scanDocumentsSectionNode: PatientChartNode, scanDocumentsInfo: any) {
        let patientDocuments = JSON.parse(scanDocumentsInfo.documentData);

        //todo: temporary fix:  exclude null documents
        patientDocuments = patientDocuments
            .filter(document => !!document);

        const patientDocumentsGroupedByDateAndType =
            this.getGroupedDocumentByDateAndType(patientDocuments);

        scanDocumentsSectionNode.children = [];

        patientDocumentsGroupedByDateAndType.forEach((documentsGroupedByDate, documentsGroupedByDateIndex) => {
            const documentCreateDate = DateHelper
                .getDate(documentsGroupedByDate.documentCreateDate);

            const parentSectionId = scanDocumentsSectionNode.id;
            const groupedByDateSectionNodeId = GuidHelper.generateNewGuid();

            const groupedByDateSectionNodeAttributes = PatientChartNodeAttributes
                .createPatientChartNodeAttributes(documentsGroupedByDateIndex + 1,
                    true, true, false, false);

            const groupedByDateSectionNode = PatientChartNode
                .createPatientChartSectionNode(groupedByDateSectionNodeId,
                    documentCreateDate, documentCreateDate, groupedByDateSectionNodeAttributes, parentSectionId);

            const documentsGroupedByTypes =
                documentsGroupedByDate.documentsGroupedByTypes;

            let documentsGroupedByTypesIndex = 1;

            for (let documentType in documentsGroupedByTypes) {
                if (documentsGroupedByTypes.hasOwnProperty(documentType)) {

                    const groupedByTypeSectionNodeAttributes = PatientChartNodeAttributes
                        .createPatientChartNodeAttributes(documentsGroupedByTypesIndex,
                            true, true, false, false);

                    const groupedByTypeSectionNodeId =
                        GuidHelper.generateNewGuid();

                    const groupedByTypeSectionNode = PatientChartNode
                        .createPatientChartSectionNode(groupedByTypeSectionNodeId, documentType,
                            documentType, groupedByTypeSectionNodeAttributes, groupedByDateSectionNodeId);

                    const documents = documentsGroupedByTypes[documentType];

                    for (let i = 0; i < documents.length; i++) {
                        const document = documents[i];
                        const documentName = document.documentName;
                        const pageNumber = document.pageNum;

                        const scanDocumentNodeTemplate = PatientChartNodeTemplateProviderService
                            .getTemplateValueForPatientChartScanDocumentNode(pageNumber);

                        const scanDocumentNodeAttributes = PatientChartNodeAttributes
                            .createPatientChartNodeAttributes(i + 1,
                                true, true, false, false);

                        const scanDocumentNodeId = GuidHelper.generateNewGuid();

                        const scanDocumentNode = PatientChartNode
                            .createPatientChartNode(scanDocumentNodeId,
                                documentName, documentName,
                                PatientChartNodeType.ScanDocumentNode, {}, scanDocumentNodeAttributes,
                                groupedByTypeSectionNodeId, scanDocumentNodeTemplate);

                        groupedByTypeSectionNode.children.push(scanDocumentNode);
                    }

                    groupedByDateSectionNode.children.push(groupedByTypeSectionNode);

                    documentsGroupedByTypesIndex++;
                }
            }

            scanDocumentsSectionNode.children.push(groupedByDateSectionNode);
        });
    }

    private getGroupedDocumentByDateAndType(documents) {
        var groupedDocumentsByDate = ArrayHelper
            .groupBy(documents, 'doucmentDate');
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

    private addTemplatesToTemplateListNode(patientChartTemplateListNode: PatientChartNode, templates: Array<TemplateWithTypeName>) {
        if (!patientChartTemplateListNode || !templates || !templates.length)
            return;

        if (!patientChartTemplateListNode.children)
            patientChartTemplateListNode.children = [];

        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];

            const parentNodeId = patientChartTemplateListNode.id;
            const newlyCreatedNodeId = GuidHelper
                .generateNewGuid();

            const templateNode = PatientChartNode
                .createPatientChartTemplateNode(newlyCreatedNodeId,
                    parentNodeId, template, patientChartTemplateListNode.name);

            this.setTemplateNodeValue(template, templateNode);

            patientChartTemplateListNode.children.push(templateNode);

            const templateNodeInfo = new TemplateNodeInfo(template.id,
                template.templateOrder, template.reportTitle, newlyCreatedNodeId)

            //also we should add required templates to section "value" property
            patientChartTemplateListNode.value.push(templateNodeInfo);

            patientChartTemplateListNode.value.sort(this.sortTemplateOrderAscFunc);

            patientChartTemplateListNode.children.sort(this.sortSectionChildrenOrderAscFunc);
        }
    }

    private setTemplateNodeValue(template: Template, templateNode: PatientChartNode) {
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

        templateNode.value = templateValue;
    }

    private sortTemplateOrderAscFunc(t1, t2) {
        return t1.Order - t2.Order;
    }

    private sortSectionChildrenOrderAscFunc(t1, t2) {
        return t1.attributes.order - t2.attributes.order;
    }
}