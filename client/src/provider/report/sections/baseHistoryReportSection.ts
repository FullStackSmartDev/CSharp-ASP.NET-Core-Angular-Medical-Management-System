import { Admission } from "../../../dataModels/admission";
import { DefaultValuesProvider } from "../../defaultValuesProvider";
import { StringHelper } from "../../../helpers/stringHelper";

export class BaseHistoryReportSection {
    constructor(private defaultValuesProvider: DefaultValuesProvider) {
    }

    protected getPatientHistoryLoadOptions(patientId: string, sortFieldName: string): any {
        const byPatientIdFilter = ["PatientId", "=", patientId];
        const nonDeletedItemsFilter = ["IsDelete", "=", false];

        const sort = [{ selector: sortFieldName, desc: true }];

        return {
            filter: [byPatientIdFilter, "and", nonDeletedItemsFilter],
            sort: sort
        };
    }

    protected getSectionDefaultValue(sectionTemplate: string,
        patientHistoryName: string): Promise<string> {
        return this.defaultValuesProvider
            .getByName(patientHistoryName)
            .then(defaultValue => {
                const defaultValueLiTag = `<li>${defaultValue}</li>`;
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

    constructor(admission: Admission,
        sectionName: string = "", templateName: string = "") {

        this.admission = admission;
        this.sectionName = sectionName;
        this.templateName = templateName;
    }
}
