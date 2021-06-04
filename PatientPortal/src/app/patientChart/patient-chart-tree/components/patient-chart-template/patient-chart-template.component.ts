import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { PatientRichTextEditorComponent } from "../patient-rich-text-editor/patient-rich-text-editor.component";
import { AlertService } from "src/app/_services/alert.service";
import { PredefinedTemplateTypeNames } from "src/app/_classes/predefinedTemplateTypeNames";
import { PatientChartTrackService } from "../../../../_services/patient-chart-track.service";
import { TemplateContentCheckerService } from "../../services/template-content-checker.service";
import { SelectableItemHtmlService } from "src/app/_services/selectable-item-html.service";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { PatientSelectableListComponent } from "src/app/share/components/patient-selectable-list/patient-selectable-list.component";
import { PatientSelectableDateComponent } from "src/app/share/components/patient-selectable-date/patient-selectable-date.component";
import { PatientSelectableRangeComponent } from "src/app/share/components/patient-selectable-range/patient-selectable-range.component";

@Component({
    templateUrl: "patient-chart-template.component.html",
    selector: "patient-chart-template"
})

export class PatientChartTemplateComponent implements OnInit {
    @Input() patientChartTree: any;
    @Input() patientChartSectionValue: any;
    @Input() templateType: string;
    @Input() templateName: string;
    @Input() admissionId: string;
    @Input() patientId: string;
    @Input() companyId: string;
    @Input() isSignedOff: boolean;

    @ViewChild("detailedRichTextEditor", { static: false }) detailedRichTextEditor: PatientRichTextEditorComponent;
    @ViewChild("defaultRichTextEditor", { static: false }) defaultRichTextEditor: PatientRichTextEditorComponent;

    isDuplicateWordsWarningVisible: boolean = false;

    isDetailedEditorReady: boolean = false;
    isDefaultEditorReady: boolean = false;

    duplicateWords: string[] = [];

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

    templateStates: Array<string> = ["Default", "Detailed"];

    get templateState(): string {
        return this.templateStates[this.isDetailedTemplate ? 1 : 0];
    }

    get isDetailedTemplateShown(): boolean {
        return this.isDetailedTemplate;
    }

    get isDefaultTemplateShown(): boolean {
        return !this.isDetailedTemplate;
    }

    isDetailedTemplate: boolean;
    hasDefaultTemplate: boolean;

    constructor(private alertService: AlertService,
        private patientChartTrackService: PatientChartTrackService,
        private templateContentCheckerService: TemplateContentCheckerService,
        private selectableItemHtmlService: SelectableItemHtmlService,
        private selectableListService: SelectableListService) { }

    onTemplateStateChanged($event) {
        this.isDetailedTemplate = $event.value === this.templateStates[1];

        this.templateContent.isDetailedTemplateUsed = this.isDetailedTemplate;

        this.processDuplicateWordsIfNeeded();

        this.patientChartTrackService.emitPatientChartChanges(true);
    }

    toggleDuplicateWordsWarning() {
        this.isDuplicateWordsWarningVisible =
            !this.isDuplicateWordsWarningVisible
    }

    ngOnInit() {
        this.templateContent = this.patientChartSectionValue;
        if (this.templateContent.defaultTemplateHtml && !this.templateContent.isDetailedTemplateUsed) {
            this.hasDefaultTemplate = true;
            this.isDetailedTemplate = false;
        }
        else {
            this.hasDefaultTemplate = !!this.templateContent.defaultTemplateHtml;
            this.isDetailedTemplate = true;
        }
    }

    onDetailedContentChanged($event) {
        this.templateContent.detailedTemplateHtml = $event;
        this.processDuplicateWordsIfNeeded();
        this.patientChartTrackService.emitPatientChartChanges(true);
    }

    onDefaultContentChanged($event) {
        this.templateContent.defaultTemplateHtml = $event;
        this.patientChartTrackService.emitPatientChartChanges(true);
    }

    onDefaultContentReady($event) {
        this.isDefaultEditorReady = $event;
    }

    onDetailedContentReady($event) {
        this.isDetailedEditorReady = $event;
    }

    get isRosTemplate(): boolean {
        return this.templateType 
            && this.templateType === PredefinedTemplateTypeNames.ros;
    }

    private processDuplicateWordsIfNeeded(): void {
        if (this.isDetailedTemplate && this.isRosTemplate) {
            const hpiTemplateType = PredefinedTemplateTypeNames.hpi;

            this.duplicateWords = this.templateContentCheckerService
                .findDuplicateWords(this.templateContent.detailedTemplateHtml, hpiTemplateType, this.patientChartTree);
        }
    }

    private getFormattedDetailedTemplateContent(detailedTemplateHtml: any): string {
        const selectableListMetadataRegexp =
            new PatientSelectableListComponent(this.selectableItemHtmlService, this.selectableListService, this.alertService)
                .metadataCodeRegexp;

        const selectableDateMetadataRegexp =
            new PatientSelectableDateComponent(this.alertService, this.selectableItemHtmlService)
                .metadataCodeRegexp;

        const selectableRangeMetadataRegexp =
            new PatientSelectableRangeComponent(this.selectableItemHtmlService, this.alertService)
                .metadataCodeRegexp;

        const metadataRegexps = [
            selectableListMetadataRegexp,
            selectableDateMetadataRegexp,
            selectableRangeMetadataRegexp
        ];

        return this.selectableItemHtmlService.wrapBoldTagAroundSelectableElementsValues(detailedTemplateHtml, metadataRegexps)
    }
}