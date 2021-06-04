import { Component, Input, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter } from "@angular/core";
import { PatientSelectableRootComponent } from 'src/app/share/components/patient-selectable-root/patient-selectable-root.component';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { SelectableItem } from 'src/app/share/classes/selectableItem';
import { ConfigService } from 'src/app/_services/config.service';

declare var tinymce: any;

@Component({
    templateUrl: 'patient-rich-text-editor.component.html',
    selector: "patient-rich-text-editor"
})
export class PatientRichTextEditorComponent implements AfterViewInit, OnDestroy {
    @Input("initialContent") initialContent: string;
    @Input() companyId: string;

    @Output() onEditorChange = new EventEmitter<any>();
    @Output() onEditorReady = new EventEmitter<boolean>();

    @ViewChild("patientSelectableRoot", { static: false }) patientSelectableRoot: PatientSelectableRootComponent;

    editor: any;
    editorId: string;

    constructor(private configService: ConfigService) {
        this.editorId = GuidHelper.generateNewGuid();
    }

    insertContent(content: string) {
        const wrappedContent =
            `<span>&nbsp;</span>${content}<span>&nbsp;</span>`;

        this.editor
            .execCommand('mceInsertContent', false, wrappedContent);
    }

    get content(): string {
        return this.editor.getContent();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            tinymce.init({
                extended_valid_elements: "span[id|metadata]",
                content_css: `${this.configService.baseUrl}/css/tinymce-extended-styles.css`,
                height: 450,
                selector: `#${this.editorId}`,
                plugins: ["lists table"],
                menubar: false,
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
                setup: editor => {
                    this.editor = editor;
                    editor.on("click", ($event) => {
                        const tagName = $event.target.tagName;
                        if (tagName === "SPAN") {
                            const id = $event.target.getAttribute("id");
                            const metadata = $event.target.getAttribute("metadata");

                            const isSelectableSpan = id && metadata;

                            if (isSelectableSpan) {
                                this.patientSelectableRoot
                                    .tryExecuteSelectableItem($event.target, false);
                            }
                        }
                    });

                    editor.on("Change", () => {
                        this.emitContentChange();
                    });
                },
                init_instance_callback: (editor: any) => {
                    editor && this.initialContent && editor.setContent(this.initialContent);
                    this.onEditorReady.next(true);
                }
            });
        }, 0);
    }

    ngOnDestroy(): void {
        tinymce.remove(this.editor);
    }

    onSelectableItemValueChanged(selectableItemsToChange: Array<SelectableItem>) {
        if (selectableItemsToChange && selectableItemsToChange.length) {

            for (let i = 0; i < selectableItemsToChange.length; i++) {
                const selectableItemToChange = selectableItemsToChange[i];
                const id = selectableItemToChange.id;
                const value = selectableItemToChange.value;

                this.editor.$("#" + id).text(value);
            }
        }

        this.emitContentChange();
    }

    private emitContentChange() {
        const content = this.editor.getContent();
        this.onEditorChange.emit(content);
    }
}