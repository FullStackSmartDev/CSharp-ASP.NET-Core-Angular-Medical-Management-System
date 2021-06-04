import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { ChiefComplaintKeywordsViewDataService } from '../../provider/dataServices/read/readDataServices';

@Component({
  templateUrl: 'matchedChiefComplaintKeywordsComponent.html',
  selector: 'matched-chief-complaint-keywords'
})

export class MatchedChiefComplaintKeywordsComponent implements OnInit {
  private _allegationsString: string = "";

  @Input("allegations")
  set allegations(allegations: string) {
    this._allegationsString = allegations;

    this.loadMatchedChiefComplaintKeywords();
  }

  @Output() onMappedTemplatesAdded: EventEmitter<any>
    = new EventEmitter();

  get allegations(): string {
    return this._allegationsString;
  }

  @ViewChild("matchedChiefComplaintKeywordsGrid")
  matchedChiefComplaintKeywordsGrid: DxDataGridComponent;

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

  constructor(private chiefComplaintKeywordsViewDataService: ChiefComplaintKeywordsViewDataService) { }

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
    this.onMappedTemplatesAdded.next($event);
  }

  private loadMatchedChiefComplaintKeywords() {
    const keywordsFilter = this.getKeywordsFilter();
    const loadOptions = {
      filter: keywordsFilter
    }

    this.chiefComplaintKeywordsViewDataService
      .search(loadOptions)
      .then(chiefComplaintKeywords => {

        if (!chiefComplaintKeywords.length) {
          return;
        }

        this.matchedChiefComplaintKeywords =
          this.adjustChiefComplaintKeywords(chiefComplaintKeywords);

        this.matchedKeywordsExist = true;
      })
  }

  private getKeywordsFilter() {
    if (!this.allegationsList.length) {
      return [];
    }

    const filter = [];

    for (let i = 0; i < this.allegationsList.length; i++) {
      const keyword = this.allegationsList[i];
      const keywordFilter = ["Keyword", "=", keyword];

      filter.push(keywordFilter);
      if (i !== this.allegationsList.length - 1) {
        filter.push("or");
      }
    }

    return filter;
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
          MatchedKeywords: [],
          MissedKeywords: []
        };

        let groupedChiefComplaints =
          chiefComplaintsGroupedById[chiefComplaintId];

        chiefComplaintWithKeywords.Title =
          groupedChiefComplaints[0].Title;

        const keywords =
          groupedChiefComplaints
            .map(cc => cc.Keyword);

        const missedKeywords =
          this.getMissedKeywords(keywords);

        chiefComplaintWithKeywords.MatchedKeywords = keywords;
        chiefComplaintWithKeywords.MissedKeywords = missedKeywords;

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
