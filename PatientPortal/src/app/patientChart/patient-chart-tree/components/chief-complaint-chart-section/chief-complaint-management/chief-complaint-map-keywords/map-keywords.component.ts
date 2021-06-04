import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { ChiefComplaintKeywordService } from "src/app/_services/chief-complaint-keyword.service";
import { ArrayHelper } from "src/app/_helpers/array.helper";

@Component({
    templateUrl: "map-keywords.component.html",
    selector: "map-keywords"
})

export class ChiefComplaintMapKeywordsComponent implements OnInit {
    private _allegationsString: string = "";

    @Input() companyId: string;

    @Input("allegations")
    set allegations(allegations: string) {
        this._allegationsString = allegations;
        this.loadMatchedChiefComplaintKeywords();
    }

    @Output() templatesAdded: EventEmitter<any> = new EventEmitter();

    get allegations(): string {
        return this._allegationsString;
    }

    @ViewChild("matchedKeywordsGrid", { static: false }) matchedKeywordsGrid: DxDataGridComponent;

    _delimiter: string = ",";
    matchedChiefComplaintKeywords: Array<any> = [];

    canAddMissedKeywords: boolean = false;
    missedKeywordsData: any = {
        chiefComplaintId: "",
        missedKeywords: []
    }

    canAddTemplates: boolean = false;
    templatesData: any = {
        chiefComplaintId: ""
    }

    constructor(private chiefComplaintKeywordService: ChiefComplaintKeywordService) { }

    matchedKeywordsExist: boolean = false;

    ngOnInit(): void {
        this.loadMatchedChiefComplaintKeywords();
    }

    get allegationsList(): string[] {
        if (!this.allegations) {
            return [];
        }

        return this.splitString(this.allegations);
    };

    addMissedKeywords(chiefComplaintId: string, missedKeywords: string) {
        this.missedKeywordsData.chiefComplaintId = chiefComplaintId;
        this.missedKeywordsData.missedKeywords = missedKeywords;

        this.canAddMissedKeywords = true;
    }

    onMissedKeywordsCanceled() {
        this.canAddMissedKeywords = false;
        this.resetMissedKeywordsData();
    }

    onMissedKeywordsAdded() {
        this.canAddMissedKeywords = false;
        this.resetMissedKeywordsData();
        this.loadMatchedChiefComplaintKeywords();
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
        this.templatesAdded.next($event);
    }

    private loadMatchedChiefComplaintKeywords() {
        this.chiefComplaintKeywordService
            .getByKeywords(this.allegationsList, this.companyId)
            .then(chiefComplaintKeywords => {

                if (!chiefComplaintKeywords.length) {
                    return;
                }

                this.matchedChiefComplaintKeywords =
                    this.adjustChiefComplaintKeywords(chiefComplaintKeywords);

                this.matchedKeywordsExist = true;
            })
    }

    private adjustChiefComplaintKeywords(chiefComplaints: Array<any>): any[] {
        if (chiefComplaints && !chiefComplaints.length) {
            return [];
        }

        const chiefComplaintsGroupedById = ArrayHelper.groupBy(chiefComplaints, "id");

        const chiefComplaintsResult = [];

        for (let chiefComplaintId in chiefComplaintsGroupedById) {
            if (chiefComplaintsGroupedById.hasOwnProperty(chiefComplaintId)) {
                let chiefComplaintWithKeywords = {
                    id: chiefComplaintId,
                    title: "",
                    matchedKeywords: [],
                    missedKeywords: []
                };

                let groupedChiefComplaints = chiefComplaintsGroupedById[chiefComplaintId];

                chiefComplaintWithKeywords.title = groupedChiefComplaints[0].title;

                const keywords = groupedChiefComplaints.map(cc => cc.value);

                const missedKeywords = this.getMissedKeywords(keywords);

                chiefComplaintWithKeywords.matchedKeywords = keywords;
                chiefComplaintWithKeywords.missedKeywords = missedKeywords;

                chiefComplaintsResult.push(chiefComplaintWithKeywords);
            }
        }
        return chiefComplaintsResult;
    }

    private getMissedKeywords(keywords: string[]): string[] {
        const missedKeywords = [];

        for (let i = 0; i < this.allegationsList.length; i++) {
            const allegation = this.allegationsList[i];
            if (keywords.indexOf(allegation) === -1) {
                missedKeywords.push(allegation);
            }
        }

        return missedKeywords;
    }

    private splitString(str: string): string[] {
        return str.split(this._delimiter)
            .map(a => a.trim());
    }

    private resetMissedKeywordsData() {
        this.missedKeywordsData.chiefComplaintId = "";
        this.missedKeywordsData.missedKeywords = [];
    }

    private resetTemplatesData(): any {
        this.templatesData.chiefComplaintId = "";
    }
}
