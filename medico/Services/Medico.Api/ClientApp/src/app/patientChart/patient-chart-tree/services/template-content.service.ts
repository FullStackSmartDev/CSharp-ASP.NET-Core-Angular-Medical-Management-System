import { Injectable } from '@angular/core';
import { PatientChartService } from '../../services/patient-chart.service';
import { ObjectHelper } from 'src/app/_helpers/object.helper';

@Injectable()
export class TemplateContentService {
    constructor(private patientChartService: PatientChartService) {

    }

    getTemplatesContent(patientChart: any, templateType: string): string {
        return "";
        // const templateListSection = this.
        //     patientChartService.getPatientChartSectionByName(templateType, patientChart);

        // const templates = templateListSection.children;

        // let templatesContent = "";

        // if (templates && templates.length) {
        //     for (let i = 0; i < templates.length; i++) {
        //         const template = templates[i];
        //         const isDetailedContentExist = !ObjectHelper.isObjectEmpty(template.value)
        //             && template.value.templateContent && template.value.templateContent.detailedTemplateHtml;

        //         if (isDetailedContentExist) {
        //             templatesContent += ` ${template.value.templateContent.detailedTemplateHtml}`;
        //         }
        //     }
        // }

        // return templatesContent;
    }
}