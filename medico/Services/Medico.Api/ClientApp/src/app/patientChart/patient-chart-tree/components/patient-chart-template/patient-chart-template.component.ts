import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { PatientRichTextEditorComponent } from "../patient-rich-text-editor/patient-rich-text-editor.component";
import { PredefinedTemplateTypeNames } from "src/app/_classes/predefinedTemplateTypeNames";
import { PatientChartTrackService } from "../../../../_services/patient-chart-track.service";
import { TemplateContentCheckerService } from "../../services/template-content-checker.service";
import { SelectableItemHtmlService } from "src/app/_services/selectable-item-html.service";
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import { TemplateHistoryService } from 'src/app/_services/template-history.service';
import { TemplateHistory } from 'src/app/_models/templateHistory';
import { TemplateHistorySearchFilter } from 'src/app/_models/TemplateHistorySearchFilter';
import { ExpressionExecutionService } from 'src/app/_services/expression-execution.service';
import { ExpressionExecutionRequest } from 'src/app/_models/expression-execution-request';
import notify from 'devextreme/ui/notify';

@Component({
    templateUrl: "patient-chart-template.component.html",
    selector: "patient-chart-template"
})
export class PatientChartTemplateComponent implements OnInit {
    @Input() patientChartDocumentNode: PatientChartNode;
    @Input() patientChartNode: PatientChartNode;
    @Input() templateName: string;
    @Input() templateType: string;
    @Input() companyId: string;
    @Input() isSignedOff: boolean;
    @Input() admissionId: string;
    @Input() templateId: string;

    isTemplateHistorySet: boolean = false;

    selectedModeIndex: number = 0;

    private defaultTemplateModeIndex: number = 0;
    private detailedTemplateModeIndex: number = 1;

    templateModes = [
        {
            id: this.defaultTemplateModeIndex,
            text: "Default"
        },
        {
            id: this.detailedTemplateModeIndex,
            text: "Detailed"
        }
    ];

    onTemplateModeSelected(selectedMode: any) {
        this.isDetailedTemplate =
            selectedMode.id === this.detailedTemplateModeIndex;

        this.templateContent.isDetailedTemplateUsed = this.isDetailedTemplate;

        this.processDuplicateWordsIfNeeded();

        if (this.isDetailedTemplate)
            this.calculateExpressions();
    }

    // the property has to be used instead 'templateId' due to the issue of wrong setting of templateId
    get correctTemplateId(): string {
        const patientChartNodeId = this.patientChartNode.id;
        //before fix, template id setting was wrong - templateId was equal to node id
        if (patientChartNodeId !== this.templateId)
            return this.templateId;

        return this.patientChartNode
            .attributes.nodeSpecificAttributes.templateId;
    }

    @ViewChild("detailedRichTextEditor", { static: false }) detailedRichTextEditor: PatientRichTextEditorComponent;
    @ViewChild("defaultRichTextEditor", { static: false }) defaultRichTextEditor: PatientRichTextEditorComponent;

    templateHistory: TemplateHistory = null;

    isDuplicateWordsWarningVisible: boolean = false;
    isPreviousDetailedContentVisible: boolean = false;

    isDetailedEditorReady: boolean = false;
    isDefaultEditorReady: boolean = false;

    previousDetailedContent: string = "";

    duplicateWords: string[] = [];

    get doesTemplateHistoryExist(): boolean {
        return !!this.templateHistory && !!this.templateHistory.detailedContent;
    }

    get duplicateWordsText(): string {
        return this.duplicateWords.length
            ? this.duplicateWords.join(", ")
            : "";
    }

    templateContent: any = {
        defaultTemplateHtml: "",
        detailedTemplateHtml: "",
        isDetailedTemplateUsed: false
    };

    get templateResult(): string {
        if (!this.isDetailedTemplate)
            return this.templateContent.defaultTemplateHtml;

        return this.getFormattedDetailedTemplateContent(this.templateContent.detailedTemplateHtml);
    }

    get isDetailedTemplateShown(): boolean {
        return this.isDetailedTemplate;
    }

    get isDefaultTemplateShown(): boolean {
        return !this.isDetailedTemplate;
    }

    isDetailedTemplate: boolean;
    hasDefaultTemplate: boolean;

    constructor(private patientChartTrackService: PatientChartTrackService,
        private templateContentCheckerService: TemplateContentCheckerService,
        private selectableItemHtmlService: SelectableItemHtmlService,
        private templateHistoryService: TemplateHistoryService,
        private expressionExecutionService: ExpressionExecutionService) { }

    toggleDuplicateWordsWarning($event) {
        $event.preventDefault();

        this.isDuplicateWordsWarningVisible =
            !this.isDuplicateWordsWarningVisible;
    }

    togglePreviousDetailedContentPopover($event) {
        $event.preventDefault();

        this.isPreviousDetailedContentVisible =
            !this.isPreviousDetailedContentVisible;

        if (this.togglePreviousDetailedContentPopover && !this.isTemplateHistorySet)
            this.setPreviousTemplateHistory();
    }

    ngOnInit() {
        this.templateContent = this.patientChartNode.value;
        if (this.templateContent.defaultTemplateHtml && !this.templateContent.isDetailedTemplateUsed) {
            this.hasDefaultTemplate = true;
            this.isDetailedTemplate = false;
        }
        else {
            this.hasDefaultTemplate = !!this.templateContent.defaultTemplateHtml;
            this.calculateExpressions()
                .then(() => this.isDetailedTemplate = true);
        }
    }

    savePatientChart() {
        this.patientChartTrackService
            .emitPatientChartChanges(PatientChartNodeType.TemplateNode);
    }

    onDetailedContentChanged($event) {
        this.templateContent.detailedTemplateHtml = $event;
        this.processDuplicateWordsIfNeeded();
    }

    onDefaultContentChanged($event) {
        this.templateContent.defaultTemplateHtml = $event;
    }

    onDefaultContentReady($event) {
        this.isDefaultEditorReady = $event;
    }

    onDetailedContentReady($event) {
        this.isDetailedEditorReady = $event;
    }

    calculateExpressions() {
        const expressionExecutionRequest =
            new ExpressionExecutionRequest();

        expressionExecutionRequest.admissionId = this.admissionId;
        expressionExecutionRequest.detailedTemplateContent =
            this.templateContent.detailedTemplateHtml;

        return this.expressionExecutionService
            .calculateExpressionsInTemplate(expressionExecutionRequest)
            .then(detailedTemplateContent => {
                this.templateContent.detailedTemplateHtml = detailedTemplateContent;
                notify("Expressions were successfully recalculated", "info", 800);
            })
    }

    get isRosTemplate(): boolean {
        return this.templateType
            && this.templateType === PredefinedTemplateTypeNames.ros;
    }

    private processDuplicateWordsIfNeeded(): void {
        if (this.isDetailedTemplate && this.isRosTemplate) {
            const hpiTemplateType = PredefinedTemplateTypeNames.hpi;

            this.duplicateWords = this.templateContentCheckerService
                .findDuplicateWords(this.templateContent.detailedTemplateHtml, hpiTemplateType, this.patientChartDocumentNode);
        }
    }

    private getFormattedDetailedTemplateContent(detailedTemplateHtml: any): string {
        return this.selectableItemHtmlService
            .wrapBoldTagAroundSelectableElementsValues(detailedTemplateHtml)
    }

    private setPreviousTemplateHistory() {
        const searchFilter = new TemplateHistorySearchFilter();
        searchFilter.admissionId = this.admissionId;
        searchFilter.templateId = this.correctTemplateId;

        this.templateHistoryService.get(searchFilter)
            .then(templateHistory => {
                this.isTemplateHistorySet = true;
                this.templateHistory = templateHistory;
            });
    }
}