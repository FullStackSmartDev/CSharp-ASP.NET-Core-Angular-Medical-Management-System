import { Component, Input, ViewChild, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { PatientSelectableRootComponent } from '../templateSelectableItemsManagement/patient/patientSelectableRootComponent/patientSelectableRootComponent';
import { LoadPanelService } from '../../provider/loadPanelService';

@Component({
    templateUrl: 'detailedTemplatePreviewComponent.html',
    selector: 'detailed-template-preview'
})

export class DetailedTemplatePreviewComponent implements AfterViewInit {
    @Input("detailedTemplateContent") detailedTemplateContent: string;
    @Output("detailedTemplatePreviewHidden") detailedTemplatePreviewHidden
        = new EventEmitter();

    @ViewChild("detailedTemplatePreviewPopup") detailedTemplatePreviewPopup: DxPopupComponent;
    @ViewChild("patientSelectableRoot") patientSelectableRoot: PatientSelectableRootComponent;

    constructor(private loadPanelService: LoadPanelService) {

    }

    showSelectableItem($event) {
        const target = $event.srcElement;
        const isMetadataAttributeExist =
            target.getAttribute("metadata");

        if (isMetadataAttributeExist) {
            this.patientSelectableRoot
                .tryExecuteSelectableItem(target, true);
        }
    }

    onSelectableItemValueChanged($event): void {
        this.loadPanelService.showLoader();
        if ($event.length) {
            const alreadyReplacedItems = [];

            for (let i = 0; i < $event.length; i++) {
                const selectableItem = $event[i];
                const metadata = selectableItem.metadata;
                const value = selectableItem.value;

                if (alreadyReplacedItems.indexOf(metadata) === -1) {
                    const textToReplace = `>${metadata}<`;
                    const regexToReplace = new RegExp(textToReplace, "g");
                    const textValue = `>${value}<`;

                    this.detailedTemplateContent =
                        this.detailedTemplateContent
                            .replace(regexToReplace, textValue);

                    alreadyReplacedItems.push(metadata);
                }
            }
        }
        this.loadPanelService.hideLoader();
    }

    onDetailedTemplatePreviewPopupHidden(): void {
        this.detailedTemplatePreviewHidden.next();
    }

    ngAfterViewInit(): void {
        this.patientSelectableRoot
            .initSelectableItems(this.detailedTemplateContent);
    }
}