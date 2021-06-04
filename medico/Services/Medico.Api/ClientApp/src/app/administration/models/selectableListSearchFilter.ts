import { SearchFilter } from './SearchFilter';

export class SelectableListSearchFilter extends SearchFilter {
    categoryId: string;
    librarySelectableListId: string;
    librarySelectableListIds: string[];
    excludeImported: boolean;
}