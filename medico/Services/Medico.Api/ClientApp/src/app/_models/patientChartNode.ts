import { PatientChartNodeType } from './patientChartNodeType';
import { Template } from './template';
import { PatientChartNodeAttributes } from './patientChartNodeAttributes';
import { PatientChartNodeTemplateProviderService } from '../_services/patient-chart-node-template-provider.service';

export class PatientChartNode {
    id: string;
    name: string;
    title: string;
    type: PatientChartNodeType;
    value: any | any[];
    attributes: PatientChartNodeAttributes;
    children: PatientChartNode[];
    parentId: string;
    template: string;

    static createPatientChartNode(id: string,
        name: string, title: string, type: PatientChartNodeType,
        value: any | any[], attributes: PatientChartNodeAttributes,
        parentId: string, template: string): PatientChartNode {
        const patientChartNode = new PatientChartNode();

        patientChartNode.id = id;
        patientChartNode.name = name;
        patientChartNode.title = title;
        patientChartNode.type = type;
        patientChartNode.value = value;
        patientChartNode.attributes = attributes;
        patientChartNode.children = [];
        patientChartNode.parentId = parentId;
        patientChartNode.template = template;

        return patientChartNode;
    }

    static createPatientChartTemplateNode(id: string,
        parentId: string, template: Template, templateTypeName: string): PatientChartNode {
        const patientChartNode = new PatientChartNode();

        patientChartNode.id = id;
        patientChartNode.name = template.reportTitle;
        patientChartNode.title = template.reportTitle;
        patientChartNode.type = PatientChartNodeType.TemplateNode;
        patientChartNode.value = {
            defaultTemplateHtml: template.defaultTemplateHtml,
            detailedTemplateHtml: template.initialDetailedTemplateHtml,
            isDetailedTemplateUsed: !template.defaultTemplateHtml
        };

        patientChartNode.parentId = parentId;
        patientChartNode.template = PatientChartNodeTemplateProviderService
            .getTemplateValueForPatientChartTemplateNode(template.id, templateTypeName);

        const nodeSpecificAttributes = {
            templateId: template.id
        };

        const attributes = PatientChartNodeAttributes
            .createPatientChartNodeAttributes(template.templateOrder,
                true, false, false, false, nodeSpecificAttributes);

        patientChartNode.attributes = attributes;

        return patientChartNode;
    }

    static createPatientChartTemplateListNode(id: string,
        name: string, title: string,
        attributes: PatientChartNodeAttributes,
        parentId: string): PatientChartNode {
        const patientChartNode = new PatientChartNode();

        patientChartNode.id = id;
        patientChartNode.name = name;
        patientChartNode.title = title;
        patientChartNode.type = PatientChartNodeType.TemplateListNode;
        patientChartNode.value = [];
        patientChartNode.attributes = attributes;
        patientChartNode.children = [];
        patientChartNode.parentId = parentId;
        patientChartNode.template = PatientChartNodeTemplateProviderService
            .getTemplateValueForPatientChartTemplateListNode(name);

        return patientChartNode;
    }

    static createPatientChartSectionNode(id: string,
        name: string, title: string,
        attributes: PatientChartNodeAttributes,
        parentId: string): PatientChartNode {
        const patientChartNode = new PatientChartNode();

        patientChartNode.id = id;
        patientChartNode.name = name;
        patientChartNode.title = title;
        patientChartNode.type = PatientChartNodeType.SectionNode;
        patientChartNode.value = {};
        patientChartNode.attributes = attributes;
        patientChartNode.children = [];
        patientChartNode.parentId = parentId;
        patientChartNode.template = ""

        return patientChartNode;
    }
}