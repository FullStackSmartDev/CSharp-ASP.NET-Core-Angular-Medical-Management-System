import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    templateUrl: "patient-template-editor.component.html",
    selector: "patient-template-editor"
})
export class PatientTemplateEditorComponent {
    @Input() companyId: string;
    @Input() detailedTemplateContent: string;

    @Output() onContentChanged = new EventEmitter<string>();

    selectedModeIndex: number = 0;
    private selectableEditorModeIndex: number = 0;
    private manualEditorModeIndex: number = 1;

    editorModes = [
        {
            id: this.selectableEditorModeIndex,
            text: "Selectable"
        },
        {
            id: this.manualEditorModeIndex,
            text: "Manual"
        }
    ];

    currentModeIndex: number = this.editorModes[0].id;

    onEditorModeSelected(editorMode: any) {
        this.currentModeIndex = editorMode.id;
    }

    onDetailedContentReady($event) { }

    onDetailedContentChanged(content: string) {
        this.onContentChanged.next(content);
    }

    get isManualModeSelected(): boolean {
        return this.currentModeIndex === this.manualEditorModeIndex;
    }

    get isSelectableModeSelected(): boolean {
        return this.currentModeIndex === this.selectableEditorModeIndex;
    }
}