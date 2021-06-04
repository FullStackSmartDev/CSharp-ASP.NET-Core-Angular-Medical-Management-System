import { Component, Input, AfterViewInit, OnDestroy } from "@angular/core";
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { ConfigService } from 'src/app/_services/config.service';
import { Constants } from 'src/app/_classes/constants';

declare var tinymce: any;

@Component({
    selector: "admin-rich-text-editor",
    templateUrl: "./admin-rich-text-editor.component.html"
})
export class AdminRichTextEditorComponent implements AfterViewInit, OnDestroy {
    @Input("initialContent") initialContent: string;

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
                content_css: `${this.configService.baseUrl}css/tinymce-extended-styles.css`,
                extended_valid_elements: `${Constants.selectableItem.tagName.toLowerCase()}[${Constants.expressionItem.attributes.expressionId.toLowerCase()}|${Constants.selectableItem.attributes.id}|${Constants.selectableItem.attributes.metadata}|${Constants.selectableItem.attributes.selectableType}|contenteditable|${Constants.selectableItem.attributes.initialValue}]`,
                height: 450,
                body_class : "admin-rich-text-editor",
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