export interface ISearchableSource {
    searchWithCount(loadOptions: any, fieldToCount: string, requestedFields: string[]): Promise<any>;

    search(loadOptions: any, requestedFields: string[]): Promise<any[]>;

    count(loadOptions: any, fieldToCount: string): Promise<number>;

    getById(idColumnName: string, columnValue: string): Promise<any>;
}

export interface ISearchableByName {
    getByName(name: string): Promise<any>;
}

export interface IEntityCountProvider {
    count(loadOptions: any, fieldToCount: string): Promise<number>;
}