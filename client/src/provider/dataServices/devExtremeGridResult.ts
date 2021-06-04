export class DevExtremeGridResult<T> {
    Data: T[];
    TotalCount: number;

    constructor(data: T[] = [], totalCount = 0) {
        this.Data = data;
        this.TotalCount = totalCount;
    }
}