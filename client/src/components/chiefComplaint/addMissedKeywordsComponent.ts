import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { DxPopupComponent, DxListComponent } from 'devextreme-angular';
import { LoadPanelService } from '../../provider/loadPanelService';
import { ChiefComplaintKeywordDataService, ChiefComplaintRelatedKeywordDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ChiefComplaintKeyword } from '../../dataModels/chiefComplaintKeyword';
import { ChiefComplaintRelatedKeyword } from '../../dataModels/chiefComplaintRelatedKeyword';

@Component({
    templateUrl: 'addMissedKeywordsComponent.html',
    selector: 'add-missed-keywords'
})

export class AddMissedKeywordsComponent implements AfterViewInit {
    @Input("chiefComplaintId") chiefComplaintId: string;
    @Input("missedKeywords") missedKeywords: Array<string>;

    @Output() onMissedKeywordsAdded: EventEmitter<Array<any>>
        = new EventEmitter();

    @Output() onMissedKeywordsCanceled: EventEmitter<Array<any>>
        = new EventEmitter();

    @ViewChild("missedKeywordsPopup") missedKeywordsPopup: DxPopupComponent;
    @ViewChild("missedKeywordsList") missedKeywordsList: DxListComponent;

    constructor(private loadPanelService: LoadPanelService,
        private chiefComplaintKeywordDataService: ChiefComplaintKeywordDataService,
        private chiefComplaintRelatedKeywordDataService: ChiefComplaintRelatedKeywordDataService) {

    }

    ngAfterViewInit(): void {
        this.missedKeywordsPopup
            .instance
            .show();
    }

    saveMissedKeywords() {
        const selectedMissedKeywords =
            this.missedKeywordsList.selectedItems;
        if (!selectedMissedKeywords.length) {
            this.onMissedKeywordsCanceled.next();
            return;
        }

        this.loadPanelService.showLoader();

        const missedKeywordAddPromises = [];
        for (let i = 0; i < selectedMissedKeywords.length; i++) {
            const missedKeyword = selectedMissedKeywords[i];
            missedKeywordAddPromises.push(this.addMissedKeyword(missedKeyword));
        }

        Promise.all(missedKeywordAddPromises)
            .then(() => {
                this.loadPanelService.hideLoader();
                this.onMissedKeywordsAdded.next();
            });
    }

    cancelMissedKeywords() {
        this.onMissedKeywordsCanceled.next();
    }

    private addMissedKeyword(missedKeyword: string): Promise<any> {
        return this.getMissedKeywordId(missedKeyword)
            .then(keywordId => {
                const newChiefComplaintRelatedKeyword =
                    new ChiefComplaintRelatedKeyword()
                newChiefComplaintRelatedKeyword.ChiefComplaintId = this.chiefComplaintId;
                newChiefComplaintRelatedKeyword.KeywordId = keywordId;

                return this.chiefComplaintRelatedKeywordDataService
                    .create(newChiefComplaintRelatedKeyword);
            });
    }

    private getMissedKeywordId(missedKeyword: string): Promise<string> {
        const loadOptions = {
            filter: ["Value", "=", missedKeyword]
        }

        return this.chiefComplaintKeywordDataService
            .firstOrDefault(loadOptions)
            .then(keyword => {
                if (keyword) {
                    return keyword.Id;
                }

                const chiefComplaintKeyword =
                    new ChiefComplaintKeyword();
                chiefComplaintKeyword.Value = missedKeyword;

                //we should create new keyword if not exists
                return this.chiefComplaintKeywordDataService
                    .create(chiefComplaintKeyword)
                    .then(() => {
                        return chiefComplaintKeyword.Id;
                    })

            })
    }
}
