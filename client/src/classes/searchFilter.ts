import { ApplicationConfigurationService } from "../provider/applicationConfigurationService";

export class SearchFilter {
    searchValue: string = "";
    skip: number;
    take: number;
    usePagination: boolean;
    includeDeletedItems: boolean;

    constructor(filter) {
        this.searchValue = filter.value || "";
        this.usePagination = filter.usePagination || false;
        this.skip = filter.skip || 0;
        this.take = filter.take || ApplicationConfigurationService.defaultTakeItemsCount;
        this.includeDeletedItems = filter.includeDeletedItems;
    }

    static createFromDataSourceLoadOptions(loadOptions: any,
        includeDeletedItems, usePagination: boolean = true) {
        return new SearchFilter({
            value: loadOptions.searchValue,
            usePagination: usePagination,
            skip: loadOptions.skip,
            take: loadOptions.take,
            includeDeletedItems: includeDeletedItems
        });
    }
}