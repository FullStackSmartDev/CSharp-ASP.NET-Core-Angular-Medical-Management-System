import { Injectable } from '@angular/core';
import { DataService } from './dataService';
import { TableNames } from '../constants/tableNames';
import { StringHelper } from '../helpers/stringHelper';
import { TemplateType } from '../constants/templateType';
import { ArrayHelper } from '../helpers/arrayHelper';
import { CommonConstants } from '../constants/commonConstants';

@Injectable()
export class PatienDataModelService {
    _patientDataModelTree: any;
    _patientDataModelProjectionTree: any;

    _promises: Array<Promise<any>> = [];

    constructor(private dataService: DataService) { }

    getPatientAdmission(appointmentId: string): Promise<any> {
        const self = this;
        return this.dataService
            .getAppointmentInfoById(appointmentId)
            .then(appointmentInfo => {
                let admissionId = appointmentInfo.AdmissionId;
                let patientId = appointmentInfo.PatientDemographicId;
                let appointmentId = appointmentInfo.AppointmentId;

                let queryPromises: Array<any> = [];

                const patinetAdmissionModelByCompanyId = self
                    .dataService
                    .getPatientAdmissionModelByCompanyId();

                const requiredTemplatesByCompanyId = self
                    .dataService
                    .getRequiredTemplates();

                queryPromises.push(patinetAdmissionModelByCompanyId,
                    requiredTemplatesByCompanyId);

                return Promise.all(queryPromises)
                    .then(results => {
                        if (!results[0].JsonPatientDataModel)
                            throw "Patient admission model should exists";

                        const isNewAdmission = !admissionId;

                        const patinetAdmissionModel = JSON.parse(results[0].JsonPatientDataModel);
                        const requiredTemplates = results[1];

                        if (requiredTemplates.length > 0 && isNewAdmission) {
                            self.addRequiredTemplatesToPatientDataModel(patinetAdmissionModel.patientRoot, requiredTemplates);
                        }

                        if (!admissionId) {
                            let newPatientAdmission = {
                                CreatedDate: new Date(),
                                PatientDemographicId: patientId,
                                AppointmentId: appointmentId,
                                AdmissionData: JSON.stringify(patinetAdmissionModel),
                                IsDelete: false
                            };

                            return self.dataService.create(TableNames.admission, newPatientAdmission, false)
                                .then((createdPatientAdmissionId) => {
                                    newPatientAdmission["Id"] = createdPatientAdmissionId;

                                    return self.dataService.update(TableNames.appointment, appointmentId, { AdmissionId: createdPatientAdmissionId })
                                        .then(() => {
                                            return newPatientAdmission;
                                        })
                                        .catch(error => console.log(error));
                                }).catch(error => {
                                    console.log(error);
                                })
                        }
                        else {
                            return self.dataService.getById(TableNames.admission, admissionId)
                                .then(
                                    admission => {
                                        let currentPatientAdmissionModel = JSON.parse(admission.AdmissionData);
                                        admission.AdmissionData = JSON.stringify(currentPatientAdmissionModel);
                                        return self.dataService.update(TableNames.admission, admission.Id, { AdmissionData: admission.AdmissionData })
                                            .then(() => {
                                                return admission;
                                            })
                                            .catch(error => console.log(error));
                                    },
                                    error => {
                                        console.log(error);
                                    }
                                );
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
                error => {
                    console.log(error);
                }
            );
    }

    get patientDataModelTree() {
        let self = this;
        if (this._patientDataModelTree)
            return new Promise((resolve) => resolve(self._patientDataModelTree));
        return this.dataService.getById(TableNames.patientDataModel, CommonConstants.emptyGuid)
            .then(patientDataModelEntity => {
                const patientDataModel = JSON.parse(patientDataModelEntity.JsonPatientDataModel).patientRoot;
                self._patientDataModelTree = patientDataModel;
                return patientDataModel;
            })

    }

    getPatientDataModelTreeProjection(patientDataModelNode: any, isSignedOff: boolean) {
        let visible = true;

        const signedOffOnly = patientDataModelNode
            .attributes.signedOffOnly;

        if (signedOffOnly && !isSignedOff) {
            visible = false;
        }

        let id = patientDataModelNode.id;
        let text = patientDataModelNode.title;
        let name = patientDataModelNode.name;
        let checked = false;
        let expanded = false;
        let isRequired = patientDataModelNode.isRequired;

        let treeNode = new PatientDataModelNode(id, text, name, expanded, visible, checked, isRequired)

        if (patientDataModelNode.templateViewModel && patientDataModelNode.templateViewModel.templateName) {
            treeNode.templateName =
                patientDataModelNode.templateViewModel.templateName;
        }

        let nodeChildrens = patientDataModelNode.children;

        if (!nodeChildrens || nodeChildrens.length === 0)
            return treeNode;

        for (let i = 0; i < nodeChildrens.length; i++) {
            let child = nodeChildrens[i];
            treeNode.items[i] = this.getPatientDataModelTreeProjection(child, isSignedOff);
        }

        return treeNode;
    }

    getPatientAdmissionSectionById(id: string, patientAdmissionModel: any): any {
        const self = this;
        if (!patientAdmissionModel)
            throw "Invalid section";
        if (patientAdmissionModel.id === id)
            return patientAdmissionModel;
        if (patientAdmissionModel.children.length > 0) {
            for (let i = 0; i < patientAdmissionModel.children.length; i++) {
                let childrenSection = patientAdmissionModel.children[i];
                let patientAdmissionSection = self.getPatientAdmissionSectionById(id, childrenSection);
                if (patientAdmissionSection)
                    return patientAdmissionSection
            }
        }
    }

    getPatientAdmissionSectionByName(name: string, patientAdmissionModel: any): any {
        const self = this;
        if (!patientAdmissionModel)
            throw "Invalid section";
        if (patientAdmissionModel.name === name)
            return patientAdmissionModel;
        if (patientAdmissionModel.children.length > 0) {
            for (let i = 0; i < patientAdmissionModel.children.length; i++) {
                let childrenSection = patientAdmissionModel.children[i];
                let patientAdmissionSection = self.getPatientAdmissionSectionByName(name, childrenSection);
                if (patientAdmissionSection)
                    return patientAdmissionSection
            }
        }
    }

    createPatientAdmissionTemplateSection(parentSectionId: string,
        templateType: string, templateName: string,
        sectionTitle: string, attributes: any, tempateSectionId: string = ""): any {
        return {
            id: tempateSectionId ? tempateSectionId : this.dataService.generateGuid(),
            name: StringHelper.camelize(templateName),
            title: sectionTitle,
            isVisible: true,
            roles: "physician",
            children: [],
            parentId: parentSectionId,
            template: "<paragraph-template [isSignedOff]='isSignedOff' [admissionId]='admissionId' [patientId]='patientId'  [patientAdmission]='patientAdmission' [templateType]='templateType' [templateName]='templateName' [patientConfigurationNodeDataModel]='nodeData'></paragraph-template>",
            templateViewModel: { templateType: templateType, templateName: templateName },
            value: {},
            attributes: attributes
        }
    }

    private addRequiredTemplatesToPatientDataModel(patientDataModel: any,
        requiredTemplates: Array<any>): any {
        const templatesType = [
            TemplateType.ros,
            TemplateType.pe,
            TemplateType.procedure,
            TemplateType.hpi
        ];

        if (!requiredTemplates && !requiredTemplates.length) {
            return;
        }

        const requiredTemplatesGroupedByType = ArrayHelper
            .groupBy(requiredTemplates, "TemplateTypeName");

        for (let i = 0; i < templatesType.length; i++) {
            const templateTypeName = templatesType[i];
            //sections that contains templates have names that is the name
            //of template type that this section contains 
            const section = this.getPatientAdmissionSectionByName(templateTypeName, patientDataModel);
            const requiredTemplatesByType =
                requiredTemplatesGroupedByType[templateTypeName];

            this.addTemplatesToSection(section, requiredTemplatesByType);
        }
    }

    private addTemplatesToSection(section: any, templates: Array<any>) {
        if (!section || !templates || !templates.length) {
            return;
        }

        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];

            const templateTypeName = template.TemplateTypeName;
            const templateName = template.TemplateName;
            const templateTitle = template.TemplateReportTitle;
            const templateOrder = template.TemplateOrder;

            const parentSectionId = section.Id;
            const newlyCreatedSectionId = this.dataService
                .generateGuid();

            const attributes = {
                order: templateOrder,
                isVisible: true
            }

            const templateSection = this.
                createPatientAdmissionTemplateSection(
                    parentSectionId,
                    templateTypeName,
                    templateName,
                    templateTitle,
                    attributes,
                    newlyCreatedSectionId
                );
            section.children.push(templateSection);

            //also we should add required templates to section "value" property
            section.value.push({
                Id: template.Id,
                Title: templateTitle,
                Name: templateName,
                Order: templateOrder,
                SectionId: newlyCreatedSectionId
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

export class PatientDataModelNode {

    constructor(id: string,
        text: string, name: string, expanded: boolean,
        visible: boolean, checked?: boolean, isRequired?: boolean) {
        this.id = id;
        this.text = text;
        this.name = name;
        this.expanded = expanded;
        this.visible = visible;
        this.checked = checked ? true : false;
        this.isRequired = isRequired ? true : false;
        this.selected = false;
        this.templateName = "";
    }

    id: string;
    text: string;
    name: string;
    expanded: boolean;
    checked: boolean;
    isRequired: boolean;
    visible: boolean;
    items: Array<PatientDataModelNode> = [];
    selected: boolean;
    templateName: string;
}