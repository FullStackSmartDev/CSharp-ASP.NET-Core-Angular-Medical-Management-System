import { Injectable } from "@angular/core";
import { PatienDataModelService } from "../patienDataModelService";
import { ObjectHelpers } from "../../helpers/objectHelpers";
import { SelectableItemHtmlService } from "../selectableItemHtmlService";
import { PatientSelectableListComponent } from "../../components/templateSelectableItemsManagement/patient/patientSelectableListComponent/patientSelectableListComponent";
import { DataService } from "../dataService";
import { ToastService } from "../toastService";
import * as stringSimilarity from "string-similarity";
import { StringHelper } from "../../helpers/stringHelper";

@Injectable()
export class TemplatesContentProvider {
    constructor(private patienDataModelService: PatienDataModelService) {

    }

    getTemplatesContent(patientAdmissionModel: any,
        templateType: string): string {
        const templateListSection = this.patienDataModelService
            .getPatientAdmissionSectionByName(templateType, patientAdmissionModel);

        const templates = templateListSection
            .children;

        let templatesContent = "";

        if (templates && templates.length) {
            for (let i = 0; i < templates.length; i++) {
                const template = templates[i];
                const isDetailedContentExist = !ObjectHelpers.isObjectEmpty(template.value)
                    && template.value.templateContent && template.value.templateContent.DetailedTemplateHtml;

                if (isDetailedContentExist) {
                    templatesContent += ` ${template.value.templateContent.DetailedTemplateHtml}`;
                }
            }
        }

        return templatesContent;
    }
}

@Injectable()
export class TemplatesContentChecker {
    constructor(private templatesContentProvider: TemplatesContentProvider,
        private selectableItemHtmlService: SelectableItemHtmlService,
        private dataService: DataService,
        private toastService: ToastService) {

    }

    findDuplicateWords(templateContent: string, templateType: string, patientAdmissionModel: any): string[] {
        const metadataCodeRegexp: string =
            new PatientSelectableListComponent(this.dataService, this.toastService, this.selectableItemHtmlService)
                .metadataCodeRegexp;

        //selectable values that currently found in the template
        const selectableValues =
            this.getDistinctSelectableValuesFromHtml(templateContent, metadataCodeRegexp);

        if (!selectableValues.length)
            return [];

        const templatesHtmlByType = this.templatesContentProvider
            .getTemplatesContent(patientAdmissionModel, templateType);

        //selectable values that were found in all templates with specified type
        const selectableValuesByTemplateType =
            this.getDistinctSelectableValuesFromHtml(templatesHtmlByType, metadataCodeRegexp);

        if (!selectableValuesByTemplateType.length)
            return [];


        return this.getSimilarWords(selectableValues, selectableValuesByTemplateType);
    }

    private getSimilarWords(selectableValues1: string[], selectableValues2: string[]): string[] {
        const similarWords = [];

        for (let i = 0; i < selectableValues1.length; i++) {
            const selectableValue1 = selectableValues1[i];

            for (let j = 0; j < selectableValues2.length; j++) {
                const selectableValue2 = selectableValues2[j];
                const similarityValue =
                    stringSimilarity.compareTwoStrings(selectableValue1, selectableValue2);
                if (similarityValue > 0.6) {
                    similarWords.push(selectableValue1);
                    break;
                }

            }
        }

        return similarWords;
    }

    private getDistinctSelectableValuesFromHtml(htmlString: string, metadataCodeRegexp: string): string[] {
        const selectableValuesFromHtml =
            this.selectableItemHtmlService
                .getSelectableItems(htmlString, [metadataCodeRegexp])
                .map(s => s.value);

        if (!selectableValuesFromHtml || !selectableValuesFromHtml.length)
            return [];

        return selectableValuesFromHtml.reduce((values, value) => {
            const separatedByCommaValues = value.split(",");

            const trimmedValues = separatedByCommaValues
                .map(this.formatSelectableValue);

            trimmedValues.forEach(tValue => {
                if (values.indexOf(tValue) === -1) {
                    values.push(tValue);
                }
            });

            return values;

        }, []);
    }

    private formatSelectableValue(value: string): string {
        const trimmedLeftValue = StringHelper.leftTrim(value);
        return StringHelper.rightTrim(trimmedLeftValue).toLowerCase();
    }
}
