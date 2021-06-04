export interface ISearchableByName {
    getByName(name: string, companyId: string): Promise<any>;
}