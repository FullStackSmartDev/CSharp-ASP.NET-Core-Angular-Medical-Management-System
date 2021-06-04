import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Renderer2, EventEmitter, Output, OnChanges, SimpleChanges, AfterViewChecked, OnDestroy } from "@angular/core";
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { SelectableItem } from 'src/app/share/classes/selectableItem';
import { Constants } from 'src/app/_classes/constants';
import { PatientSelectableRootComponent } from 'src/app/share/components/patient-selectable-root/patient-selectable-root.component';

@Component({
    templateUrl: "selectable-items-editor.component.html",
    selector: "selectable-items-editor",
    styleUrls: ["selectable-items-editor.component.sass"]
})
export class SelectableItemsEditorComponent implements OnInit, AfterViewInit {
    private selectableItemTagName: string = "label";
    private isComponentInitiallySetup: boolean = false;

    @ViewChild("selectableItemsEditor", { static: false }) selectableItemsEditor: ElementRef;
    @ViewChild("patientSelectableRoot", { static: false }) patientSelectableRoot: PatientSelectableRootComponent;

    private _templateContent: string;

    @Input() get templateContent(): string {
        return this._templateContent;
    }

    set templateContent(value: string) {
        this._templateContent = value;

        if (this.isComponentInitiallySetup) {
            setTimeout(() => this.handleSelectableItemSelection(this.currentSelectableItemIndex), 0);
        }
        else {
            this.isComponentInitiallySetup = true;
        }
    }

    templateContentToEmit: string;

    @Output() onContentChanged = new EventEmitter<string>();

    selectableItems: SelectableItem[] = [];
    currentSelectableItem: SelectableItem;
    currentSelectableHtmlElement: any;
    currentSelectableItemIndex: number;

    constructor(private selectableItemHtmlService: SelectableItemHtmlService,
        private renderer: Renderer2) {
    }

    get doesContentContainSelectableItems(): boolean {
        return !!this.selectableItems.length
    }

    ngOnInit() {
        this.selectableItems = this.selectableItemHtmlService
            .getSelectableItems(this.templateContent,
                [
                    Constants.selectableItemTypes.list,
                    Constants.selectableItemTypes.date,
                    Constants.selectableItemTypes.range,
                    Constants.selectableItemTypes.variable,
                ]);

        this.templateContentToEmit = this.templateContent;
    }

    ngAfterViewInit(): void {
        if (this.doesContentContainSelectableItems) {
            this.registerClickingOnRightLeftButtons();

            this.selectableItemsEditor.nativeElement.focus();

            const firstSelectableItemIndex = 0;

            setTimeout(() => this.handleSelectableItemSelection(firstSelectableItemIndex), 0);
        }
    }

    onSelectableItemValueChanged(selectableItemsToChange: SelectableItem[]) {
        if (selectableItemsToChange && selectableItemsToChange.length) {
            for (let i = 0; i < selectableItemsToChange.length; i++) {
                const selectableItemToChange = selectableItemsToChange[i];
                const value = selectableItemToChange.value;

                this.renderer.setProperty(this.currentSelectableHtmlElement, "innerHTML", value);

                this.replacePreviousSelectableValueToNew(value);

                this.emitContentChange();
            }
        }
    }

    private replacePreviousSelectableValueToNew(value: string) {
        const templateContentContainer = document.createElement('div');

        templateContentContainer.innerHTML = this.templateContentToEmit;

        const selectableItemIdQuerySelector =
            `${this.selectableItemTagName}[id="${this.currentSelectableItem.id}"]`;

        const changedSelectableElement =
            templateContentContainer.querySelector(selectableItemIdQuerySelector);

        changedSelectableElement.innerHTML = value;

        this.templateContentToEmit = templateContentContainer.innerHTML;
    }

    private handleSelectableItemSelection(selectedItemIndex: number) {
        const isSelectableItemExecutionNeeded =
            selectedItemIndex !== this.currentSelectableItemIndex;

        this.currentSelectableItemIndex = selectedItemIndex;

        this.currentSelectableItem =
            this.selectableItems[selectedItemIndex];

        const selectableItemIdQuerySelector =
            `${this.selectableItemTagName}[id="${this.currentSelectableItem.id}"]`;

        this.currentSelectableHtmlElement =
            this.selectableItemsEditor.nativeElement
                .querySelector(selectableItemIdQuerySelector);

        this.markCurrentSelectableItem();

        if (isSelectableItemExecutionNeeded)
            this.patientSelectableRoot
                .tryExecuteSelectableItem(this.currentSelectableHtmlElement, false);
    }

    private markCurrentSelectableItem() {
        if (this.currentSelectableHtmlElement) {
            this.renderer
                .setStyle(this.currentSelectableHtmlElement, "border", "1px solid black");

            this.renderer
                .setStyle(this.currentSelectableHtmlElement, "padding", "3px");

            this.renderer
                .setAttribute(this.currentSelectableHtmlElement, "selected", "");
        }
    }

    private clearSelectedMark() {
        if (this.currentSelectableHtmlElement) {
            this.renderer
                .removeStyle(this.currentSelectableHtmlElement, "border");

            this.renderer
                .removeStyle(this.currentSelectableHtmlElement, "padding");

            this.renderer
                .removeAttribute(this.currentSelectableHtmlElement, "selected");
        }
    }

    private registerClickingOnRightLeftButtons() {
        this.selectableItemsEditor.nativeElement
            .addEventListener("keydown", (e) => {
                const lefttBtnCode = 37;
                const rightBtnCode = 39;

                const keyboardKeyCode = e.keyCode;

                const isRightBtnClicked =
                    keyboardKeyCode === rightBtnCode;

                if (isRightBtnClicked) {
                    this.moveToNextSelectableItem();
                    return;
                }

                const isLeftBtnClicked =
                    keyboardKeyCode === lefttBtnCode;

                if (isLeftBtnClicked) {
                    this.moveToPreviousSelectableitem();
                }
            });
    }

    private moveToNextSelectableItem() {
        const currentSelectableItemIndex =
            this.getCurrentSelectableItemIndex();

        const isIndexOfLastItem =
            currentSelectableItemIndex === this.selectableItems.length - 1;

        if (isIndexOfLastItem)
            return;

        this.clearSelectedMark();

        this.handleSelectableItemSelection(currentSelectableItemIndex + 1);
    }

    private moveToPreviousSelectableitem() {
        const currentSelectableItemIndex =
            this.getCurrentSelectableItemIndex();

        const isIndexOfFirtsItem = currentSelectableItemIndex === 0;

        if (isIndexOfFirtsItem)
            return;

        this.clearSelectedMark();

        this.handleSelectableItemSelection(currentSelectableItemIndex - 1);
    }

    private getCurrentSelectableItemIndex() {
        const currentSelectableItemId =
            this.currentSelectableItem.id;

        const allSelectableItemIds = this.selectableItems
            .map(s => s.id);

        return allSelectableItemIds.indexOf(currentSelectableItemId);
    }

    private emitContentChange() {
        this.onContentChanged.emit(this.templateContentToEmit);
    }
}