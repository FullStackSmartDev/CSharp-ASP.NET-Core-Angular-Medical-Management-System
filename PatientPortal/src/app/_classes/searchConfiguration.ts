export class SearchConfiguration {
    skipItemsCount: number = 0;
    takeItemsCount: number = 8;

    get pageSizeCount(): number {
        return this.takeItemsCount;
    }

    allowedPageSizes: Array<number> = [8, 12, 20];

    availableFilters: string[] = ["contains", "=", "startswith"];
}