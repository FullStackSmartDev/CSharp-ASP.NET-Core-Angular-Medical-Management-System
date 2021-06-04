import { SearchFilter } from './SearchFilter';

export class PatientChartSearchFilter extends SearchFilter {
    excludeImported: boolean;
    templateId: string;
    templateTypeId: string;
}