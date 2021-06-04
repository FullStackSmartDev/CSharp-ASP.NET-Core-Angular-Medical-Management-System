import { Injectable } from '@angular/core';
import { TemplateContentService } from './template-content.service';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { StringHelper } from 'src/app/_helpers/string.helper';
import * as stringSimilarity from "string-similarity";
import { Constants } from 'src/app/_classes/constants';

@Injectable()
export class TemplateContentCheckerService {
    constructor(private templateContentService: TemplateContentService,
        private selectableItemHtmlService: SelectableItemHtmlService) { }

    findDuplicateWords(templateContent: string, templateType: string, patientAdmissionModel: any): string[] {
        //selectable values that currently found in the template
        const selectableValues =
            this.getDistinctSelectableValuesFromHtml(templateContent, Constants.selectableItemTypes.list);

        if (!selectableValues.length)
            return [];

        const templatesHtmlByType = this.templateContentService
            .getTemplatesContent(patientAdmissionModel, templateType);

        //selectable values that were found in all templates with specified type
        const selectableValuesByTemplateType =
            this.getDistinctSelectableValuesFromHtml(templatesHtmlByType, Constants.selectableItemTypes.list);

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

    private getDistinctSelectableValuesFromHtml(htmlString: string, selectableType: string): string[] {
        const selectableValuesFromHtml =
            this.selectableItemHtmlService
                .getSelectableItems(htmlString, [selectableType])
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