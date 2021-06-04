import { Component, Input, AfterViewInit, OnDestroy } from "@angular/core";
import { GuidHelper } from 'src/app/_helpers/guid.helper';

declare var tinymce: any;

@Component({
    selector: "admin-rich-text-editor",
    templateUrl: "./admin-rich-text-editor.component.html"
})
export class AdminRichTextEditorComponent implements AfterViewInit, OnDestroy {
    @Input("initialContent") initialContent: string;

    editor: any;
    editorId: string;

    constructor() {
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
                height: 450,
                selector: `#${this.editorId}`,
                plugins: ["lists table code"],
                menubar: false,
                resize: false,
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table code",
                setup: editor => {
                    this.editor = editor;
                },
                init_instance_callback: (editor: any) => {
                    editor && this.initialContent && editor.setContent(this.initialContent);
                }
            });
        }, 0);
    }

    ngOnDestroy(): void {
        tinymce.remove(this.editor);
    }
}