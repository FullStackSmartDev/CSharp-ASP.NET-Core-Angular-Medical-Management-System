import { BaseHistoryReportSection, IReportContentProvider, PatientChartNodeReportInfo } from "./baseHistoryReportSection";
import { MedicalRecordService } from '../../patient-chart-tree/services/medical-record.service';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { StringHelper } from 'src/app/_helpers/string.helper';
import * as moment from 'moment';

export class ReviewedMedicalRecordsSection extends BaseHistoryReportSection implements IReportContentProvider {
    constructor(private medicalRecordDataService: MedicalRecordService,
        defaultValueService: DefaultValueService) {
        super(defaultValueService);
    }

    getPatientChartNodeReportContent(patientChartNodeReportInfo: PatientChartNodeReportInfo): Promise<string> {
        return this.medicalRecordDataService.getAllByPatientId(patientChartNodeReportInfo.patientId)
            .then(medicalRecord => {
                let medicalRecordTemplate = `
                        <div style="margin-top:15px;line-height:1em;">
                            <div><b>Patient medical records reviewed:</b><div>
                            <ul style="list-style-type:square;">{0}</ul>
                        </div>`;

                if (!medicalRecord.length) {
                    return this.getSectionDefaultValue(medicalRecordTemplate, patientChartNodeReportInfo.patientChartNode.type);
                }
                else {
                    let diagnosis = "";
                    for (let i = 0; i < medicalRecord.length; i++) {
                        const medicalRecordItem = medicalRecord[i];
                        const createDate = moment(medicalRecordItem.createDate).format('MM/DD/YYYY');

                        diagnosis += medicalRecordItem.includeNotesInReport
                            ? `<li style="margin-top: 1em;">${medicalRecordItem.documentType} ${createDate}<br>${medicalRecordItem.notes}</li>`
                            : `<li style="margin-top: 1em;">${medicalRecordItem.documentType} ${createDate}</li>`;
                    }

                    return StringHelper.format(medicalRecordTemplate, diagnosis);
                }
            });
    }
}