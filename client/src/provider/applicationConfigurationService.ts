export class ApplicationConfigurationService {
    static defaultSkipItemsCount: number = 0;
    static defaultTakeItemsCount: number = 8;
    static get defaultPageSizeCount(): number {
        return this.defaultTakeItemsCount;
    }
    static allowedPageSizes: Array<number> = [8, 12, 20];
    static startWorkingHour: number = 8;
    static endWorkingHour: number = 18;
    static searchConfiguration: any[] = ['contains', '=', 'startswith'];
    static emptyValue: string = "-";
}