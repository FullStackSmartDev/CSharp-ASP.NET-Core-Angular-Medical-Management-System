import { IReportSection, ReportSectionInfo } from "./baseHistoryReportSection";
import { TemplateDataService } from "../../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { PatienDataModelService } from "../../patienDataModelService";
import { ReportSectionNames } from "../../../constants/reportSectionNames";
import { PatientSelectableRootComponent } from "../../../components/templateSelectableItemsManagement/patient/patientSelectableRootComponent/patientSelectableRootComponent";
import { PatientSelectableListComponent } from "../../../components/templateSelectableItemsManagement/patient/patientSelectableListComponent/patientSelectableListComponent";
import { DataService } from "../../dataService";
import { ToastService } from "../../toastService";
import { SelectableItemHtmlService, SelectableItem } from "../../selectableItemHtmlService";
import { PatientSelectableDateComponent } from "../../../components/templateSelectableItemsManagement/patient/patientSelectableDateComponent/patientSelectableDateComponent";
import { PatientSelectableRangeComponent } from "../../../components/templateSelectableItemsManagement/patient/patientSelectableRangeComponent/patientSelectableRangeComponent";
import { StringHelper } from "../../../helpers/stringHelper";

export class TemplateSection implements IReportSection {
    selectableItems: SelectableItem[];
    selectableRoot: PatientSelectableRootComponent = new PatientSelectableRootComponent();

    constructor(private templateDataService: TemplateDataService,
        private patienDataModelService: PatienDataModelService,
        dataService: DataService,
        toastService: ToastService,
        selectableItemHtmlService: SelectableItemHtmlService) {

        this.selectableRoot.patientSelectableList =
            new PatientSelectableListComponent(dataService, toastService, selectableItemHtmlService);

        this.selectableRoot.patientSelectableDate =
            new PatientSelectableDateComponent(toastService, selectableItemHtmlService);

        this.selectableRoot.patientSelectableRange =
            new PatientSelectableRangeComponent(toastService, selectableItemHtmlService);

        this.selectableRoot.onSelectableItemsValuesChanged
            .subscribe(selectableItems => {
                this.selectableItems = selectableItems;
            })
    }

    getHtmlString(reportSectionInfo: ReportSectionInfo): Promise<string> {
        const patientAdmissionModel =
            JSON.parse(reportSectionInfo.admission.AdmissionData).patientRoot;

        return this.getTemplateContent(patientAdmissionModel, reportSectionInfo.templateName)
            .then(templateHtml => {
                return `
                    <div style="margin-top:15px;line-height:1em;" id="${ReportSectionNames.templateSection}">
                        ${templateHtml}
                    </div>`
            });
    }

    private getTemplateContent(patientAdmissionModel: any, templateName: string): Promise<string> {
        const loadOptions = { filter: ["Name", "=", templateName] }
        return this.templateDataService
            .firstOrDefault(loadOptions)
            .then(template => {
                const contentTemplate = `<div><b>${template.ReportTitle}:</b></div>{0}`;

                const patientAdmissionSection = this.patienDataModelService
                    .getPatientAdmissionSectionByName(templateName, patientAdmissionModel);

                if (patientAdmissionSection.value && patientAdmissionSection.value.templateContent) {
                    const templateContent = patientAdmissionSection.value.templateContent;
                    const templateHtml =
                        templateContent[templateContent.IsDetailedTemplateUsed ? "DetailedTemplateHtml" : "DefaultTemplateHtml"];

                    return StringHelper.format(contentTemplate, templateHtml);
                }

                if (!template) {
                    return StringHelper.format(contentTemplate, "");
                }

                const isDefaultTemplateExist = !!template.DefaultTemplateHtml;

                if (isDefaultTemplateExist) {
                    return StringHelper.format(contentTemplate, template.DefaultTemplateHtml);
                }

                return this.selectableRoot
                    .initSelectableItems(template.DetailedTemplateHtml)
                    .then(() => {
                        const detailedTemplateContent =
                            this.getDetailedTemplateContent(this.selectableItems, template.DetailedTemplateHtml);

                        this.selectableItems = [];

                        return StringHelper.format(contentTemplate, detailedTemplateContent);
                    });
            });
    }

    private getDetailedTemplateContent(selectableItems: SelectableItem[], templateContent: string): string {
        if (selectableItems.length) {
            const alreadyReplacedItems = [];

            for (let i = 0; i < selectableItems.length; i++) {
                const selectableItem = selectableItems[i];
                const metadata = selectableItem.metadata;
                const value = selectableItem.value;

                if (alreadyReplacedItems.indexOf(metadata) === -1) {
                    const textToReplace = `>${metadata}<`;
                    const regexToReplace = new RegExp(textToReplace, "g");
                    const textValue = `>${value}<`;

                    templateContent = templateContent
                        .replace(regexToReplace, textValue);

                    alreadyReplacedItems.push(metadata);
                }
            }

            return templateContent;
        }

        return "";
    }
}