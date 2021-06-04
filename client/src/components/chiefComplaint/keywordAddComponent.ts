import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    templateUrl: 'keywordAddComponent.html',
    selector: 'keyword-add'
})

export class KeywordAddComponent {
    @Output() onKeywordAdded: EventEmitter<string>
        = new EventEmitter();

    keyword: string = "";

    addNewKeyword() {
        if (!this.keyword) {
            return;
        }

        this.onKeywordAdded.next(this.keyword);
        this.keyword = "";
    }
}
