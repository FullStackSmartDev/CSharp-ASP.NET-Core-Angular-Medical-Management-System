import { BaseSearchFilter } from './baseSearchFilter';

export class ImportedItemsSearchFilter extends BaseSearchFilter {
    companyId: string | null;
    excludeImported: boolean;
}