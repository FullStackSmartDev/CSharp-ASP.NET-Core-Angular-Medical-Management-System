export class SearchResult {
    data: Array<any>;
    totalCount: number;

    constructor(data: Array<any> = [], totalCount: number = 0) {
        this.data = data;
        this.totalCount = totalCount;
    }
}