import { ConfigService } from './config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SelectableListCategory } from '../administration/models/selectableListCategory';
import { SearchFilter } from '../administration/models/SearchFilter';

export abstract class BaseSelectableListCategoryService {
    abstract basedCategoryUrl: string

    constructor(protected http: HttpClient,
        protected config: ConfigService) {
    }

    activateDeactivateCategory(categoryId: string, isActive: boolean): Promise<any> {
        const patchObject = [{
            "op": "add",
            "path": "/isActive",
            "value": isActive
        }];

        return this.http.patch(`${this.config.apiUrl}${this.basedCategoryUrl}/${categoryId}`, patchObject)
            .toPromise();
    }

    getByTitle(categoryTitle: string, companyId: string = null): Promise<SelectableListCategory | null> {
        const categoryTitleFilter =
            this.getCategoryTitleFilter(categoryTitle, companyId);

        return this.getByFilter(categoryTitleFilter)
            .then(categories => {
                return categories[0];
            });
    }

    getById(id: string): Promise<SelectableListCategory> {
        return this.http.get<SelectableListCategory>(`${this.config.apiUrl}${this.basedCategoryUrl}/${id}`)
            .toPromise();
    }

    save(category: SelectableListCategory): Promise<any> {
        return this.http.post<void>(`${this.config.apiUrl}${this.basedCategoryUrl}`, category)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}${this.basedCategoryUrl}/${id}`)
            .toPromise();
    }

    private getByFilter(searchFilter: SearchFilter): Promise<SelectableListCategory[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<SelectableListCategory[]>(`${this.config.apiUrl}${this.basedCategoryUrl}`, { params: queryParams })
            .toPromise();
    }

    private getCategoryTitleFilter(title: string, companyId: string = null) {
        const searchFilter = new SearchFilter();
        searchFilter.title = title;
        searchFilter.take = 1;

        if (companyId)
            searchFilter.companyId = companyId;

        return searchFilter;
    }
}