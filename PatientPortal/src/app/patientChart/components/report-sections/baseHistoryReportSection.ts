import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { Admission } from '../../models/admission';

export class BaseHistoryReportSection {
    constructor(private defaultValuesProvider: DefaultValueService) {
    }

    protected getSectionDefaultValue(sectionTemplate: string, patientHistoryName: string): Promise<string> {
        return this.defaultValuesProvider
            .getByKeyName(patientHistoryName)
            .then(defaultValue => {
                const defaultValueLiTag = `<li>${defaultValue.value}</li>`;
                return StringHelper.format(sectionTemplate, defaultValueLiTag);
            });
    }
}

export interface IReportSection {
    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string>;
}

export class ReportSectionInfo {
    sectionName: string;
    templateName: string;
    admission: Admission;

    constructor(admission: Admission, sectionName: string = "", templateName: string = "") {

        this.admission = admission;
        this.sectionName = sectionName;
        this.templateName = templateName;
    }
}
