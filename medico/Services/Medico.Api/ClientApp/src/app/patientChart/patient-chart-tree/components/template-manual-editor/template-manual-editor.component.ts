import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { Constants } from 'src/app/_classes/constants';
import { ConfigService } from 'src/app/_services/config.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';

declare var tinymce: any;

@Component({
    templateUrl: "template-manual-editor.component.html",
    selector: "template-manual-editor"
})
export class TemplateManualEditorComponent implements AfterViewInit, OnDestroy {
    @Input("initialContent") initialContent: string;

    @Output() onContentChanged = new EventEmitter<string>();

    editor: any;
    editorId: string;

    constructor(private configService: ConfigService) {
        this.editorId = GuidHelper.generateNewGuid();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            tinymce.init({
                extended_valid_elements: `${Constants.selectableItem.tagName.toLowerCase()}[${Constants.expressionItem.attributes.expressionId.toLowerCase()}|${Constants.selectableItem.attributes.id}|${Constants.selectableItem.attributes.metadata}|${Constants.selectableItem.attributes.selectableType}|contenteditable|${Constants.selectableItem.attributes.initialValue}]`,
                content_css: `${this.configService.baseUrl}css/manual-template-editor-extended-styles.css`,
                height: 450,
                body_class: "patient-rich-text-editor",
                selector: `#${this.editorId}`,
                plugins: ["lists table"],
                menubar: false,
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
                setup: editor => {
                    this.editor = editor;
                    editor.on("focusout", () => { this.emitContentChange(); });
                },
                init_instance_callback: (editor: any) => {
                    editor.setContent(this.initialContent);
                }
            });
        }, 0);
    }

    ngOnDestroy(): void {
        tinymce.remove(this.editor);
    }

    private emitContentChange() {
        const content = this.editor.getContent();
        this.onContentChanged.emit(content);
    }
}