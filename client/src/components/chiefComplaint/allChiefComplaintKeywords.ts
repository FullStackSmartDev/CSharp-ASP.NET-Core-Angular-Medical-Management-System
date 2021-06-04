import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ChiefComplaintKeywordsViewDataService } from '../../provider/dataServices/read/readDataServices';
import { ArrayHelper } from '../../helpers/arrayHelper';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    templateUrl: 'allChiefComplaintKeywords.html',
    selector: 'all-chief-complaint-keywords'
})

export class AllChiefComplaintKeywords implements OnInit {
    @Output() onMappedTemplatesAdded: EventEmitter<any>
        = new EventEmitter();

    @ViewChild("allChiefComplaintKeywordsGrid")
    allChiefComplaintKeywordsGrid: DxDataGridComponent;

    allChiefComplaintKeywordsDataSource: any = {}

    canAddTemplates: boolean = false;
    templatesData: any = {
        chiefComplaintId: ""
    }

    constructor(private chiefComplaintKeywordsViewDataService: ChiefComplaintKeywordsViewDataService) { }

    ngOnInit(): void {
        this.initChiefComplaintKeywordsDataSource();
    }

    addTemplates(chiefComplaintId: string) {
        this.templatesData.chiefComplaintId = chiefComplaintId;
        this.canAddTemplates = true;
    }

    onTemplatesCanceled() {
        this.canAddTemplates = false;
        this.resetTemplatesData();
    }

    onTemplatesAdded($event) {
        this.canAddTemplates = false;
        this.resetTemplatesData();
        this.onMappedTemplatesAdded.next($event);
    }

    private resetTemplatesData(): any {
        this.templatesData.chiefComplaintId = "";
    }

    private initChiefComplaintKeywordsDataSource() {

        this.allChiefComplaintKeywordsDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();
                const loadOptions = {
                    filter: ["Id", "=", key]
                };
                return this.chiefComplaintKeywordsViewDataService
                    .firstOrDefault(loadOptions);
            },
            load: (loadOptions: any) => {
                loadOptions.sort = [
                    {
                        selector: "Title",
                        desc: false
                    }
                ];
                return this.chiefComplaintKeywordsViewDataService
                    .search(loadOptions)
                    .then(chiefComplaintKeywords => {
                        return this.adjustChiefComplaintKeywords(chiefComplaintKeywords);
                    });
            }
        });
    }

    private adjustChiefComplaintKeywords(chiefComplaints: Array<any>): any[] {
        if (chiefComplaints && !chiefComplaints.length) {
            return [];
        }

        const chiefComplaintsGroupedById = ArrayHelper
            .groupBy(chiefComplaints, "Id");

        const chiefComplaintsResult = [];

        for (let chiefComplaintId in chiefComplaintsGroupedById) {
            if (chiefComplaintsGroupedById.hasOwnProperty(chiefComplaintId)) {
                let chiefComplaintWithKeywords = {
                    Id: chiefComplaintId,
                    Title: "",
                    Keywords: []
                };

                let groupedChiefComplaints =
                    chiefComplaintsGroupedById[chiefComplaintId];

                chiefComplaintWithKeywords.Title =
                    groupedChiefComplaints[0].Title;

                const keywords =
                    groupedChiefComplaints
                        .map(cc => cc.Keyword);

                chiefComplaintWithKeywords.Keywords = keywords;

                chiefComplaintsResult
                    .push(chiefComplaintWithKeywords);
            }
        }
        return chiefComplaintsResult;
    }
}
