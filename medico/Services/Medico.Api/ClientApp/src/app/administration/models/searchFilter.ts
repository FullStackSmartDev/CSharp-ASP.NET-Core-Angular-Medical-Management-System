import { BaseSearchFilter } from './baseSearchFilter';

export class SearchFilter extends BaseSearchFilter {
    take: number;
    companyId: string | null;
    isActive: boolean | null;
    title: string;
}