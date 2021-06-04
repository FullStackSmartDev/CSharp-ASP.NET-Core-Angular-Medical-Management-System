import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { DxPopupComponent, DxListComponent } from 'devextreme-angular';
import { ChiefComplaintKeywordService } from 'src/app/_services/chief-complaint-keyword.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
    templateUrl: 'missed-keywords.component.html',
    selector: 'missed-keywords'
})

export class MissedKeywordsComponent implements AfterViewInit {
    @Input("chiefComplaintId") chiefComplaintId: string;
    @Input("missedKeywords") missedKeywords: Array<string>;

    @Output() onMissedKeywordsAdded: EventEmitter<Array<any>> = new EventEmitter();
    @Output() onMissedKeywordsCanceled: EventEmitter<Array<any>> = new EventEmitter();

    @ViewChild("missedKeywordsPopup", { static: false }) missedKeywordsPopup: DxPopupComponent;
    @ViewChild("missedKeywordsList", { static: false }) missedKeywordsList: DxListComponent;

    constructor(private chiefComplaintKeywordService: ChiefComplaintKeywordService,
        private alertService: AlertService) {
    }

    ngAfterViewInit(): void {
        this.missedKeywordsPopup.instance.show();
    }

    saveMissedKeywords() {
        const selectedMissedKeywords = this.missedKeywordsList.selectedItems;
        if (!selectedMissedKeywords.length) {
            this.onMissedKeywordsCanceled.next();
            return;
        }

        this.chiefComplaintKeywordService.addKeywords(this.chiefComplaintId, selectedMissedKeywords)
            .then(() => {
                this.onMissedKeywordsAdded.next();
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    cancelMissedKeywords() {
        this.onMissedKeywordsCanceled.next();
    }
}
