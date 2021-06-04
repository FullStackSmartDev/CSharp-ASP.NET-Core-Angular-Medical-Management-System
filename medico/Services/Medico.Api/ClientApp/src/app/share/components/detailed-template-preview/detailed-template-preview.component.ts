import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { DxPopupComponent } from 'devextreme-angular';
import { PatientSelectableRootComponent } from 'src/app/share/components/patient-selectable-root/patient-selectable-root.component';

//todo: remove all commented code after approval of new preview mode

@Component({
    selector: "detailed-template-preview",
    templateUrl: "./detailed-template-preview.component.html"
})
export class DetailedTemplatePreviewComponent implements AfterViewInit {
    @Input() detailedTemplateContent: string;
    @Input() companyId: string;

    @Output("detailedTemplatePreviewHidden") detailedTemplatePreviewHidden
        = new EventEmitter();

    @ViewChild("detailedTemplatePreviewPopup", { static: false }) detailedTemplatePreviewPopup: DxPopupComponent;
    @ViewChild("patientSelectableRoot", { static: false }) patientSelectableRoot: PatientSelectableRootComponent;

    isDetailedTemplateContentReady: boolean = false;

    // showSelectableItem($event) {
    //     const target = $event.srcElement;
    //     const isMetadataAttributeExist =
    //         target.getAttribute("metadata");

    //     if (isMetadataAttributeExist) {
    //         this.patientSelectableRoot
    //             .tryExecuteSelectableItem(target, true);
    //     }
    // }

    // onSelectableItemValueChanged($event): void {
    //     if ($event.length) {
    //         const alreadyReplacedItems = [];

    //         for (let i = 0; i < $event.length; i++) {
    //             const selectableItem = $event[i];
    //             const metadata = selectableItem.metadata;
    //             const value = selectableItem.value;

    //             if (alreadyReplacedItems.indexOf(metadata) === -1) {
    //                 const textToReplace = `>${metadata}<`;
    //                 const regexToReplace = new RegExp(textToReplace, "g");
    //                 const textValue = `>${value}<`;

    //                 this.detailedTemplateContent =
    //                     this.detailedTemplateContent
    //                         .replace(regexToReplace, textValue);

    //                 alreadyReplacedItems.push(metadata);
    //             }
    //         }
    //     }
    // }

    onContentChanged() { }

    onDetailedTemplatePreviewPopupHidden(): void {
        this.detailedTemplatePreviewHidden.next();
    }

    ngAfterViewInit(): void {
        this.patientSelectableRoot
            .replaceSelectableItemsCodesWithDefaultValues(this.detailedTemplateContent)
            .then(content => {
                this.detailedTemplateContent = content;
                this.isDetailedTemplateContentReady = true;
            })
    }
}