import { Component, Input, AfterContentInit, OnDestroy, AfterViewInit } from "@angular/core";
import { GuidHelper } from "../../../helpers/guidHelper";

declare var tinymce: any;

@Component({
    templateUrl: 'adminRichTextEditorComponent.html',
    selector: "admin-rich-text-editor"
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
        const self = this;
        setTimeout(() => {
            tinymce.init({
                extended_valid_elements: "span[id|metadata]",
                height: 450,
                selector: `#${self.editorId}`,
                plugins: ["lists table"],
                menubar: false,
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
                setup: editor => {
                    this.editor = editor;
                },
                init_instance_callback: (editor: any) => {
                    editor && self.initialContent && editor.setContent(self.initialContent);
                }
            });
        }, 0);
    }

    ngOnDestroy(): void {
        tinymce.remove(this.editor);
    }
}