import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { SelectableListValue } from '../_models/selectableListValue';
import { SelectableList } from '../_models/selectableList';
import { SelectableListSearchFilter } from '../administration/models/selectableListSearchFilter';

export abstract class BaseSelectableListService {
    abstract baseSelectableListUrl: string;

    constructor(protected http: HttpClient,
        protected config: ConfigService) {
    }

    getFirstActiveByCategoryId(categoryId: string, companyId: string = null) {
        const firstActiveByCategoryIdFilter =
            this.getFirstActiveByCategoryIdFilter(categoryId, companyId);

        return this.getByFilter(firstActiveByCategoryIdFilter)
            .then(selectableLists => selectableLists[0]);
    }

    getFirstByCategoryId(categoryId: string, companyId: string = null) {
        const firstByCategoryIdFilter =
            this.getFirstByCategoryIdFilter(categoryId, companyId);

        return this.getByFilter(firstByCategoryIdFilter)
            .then(selectableLists => selectableLists[0]);
    }

    getSelectableListValuesById(selectableListId: string): Promise<SelectableListValue[]> {
        return this.getById(selectableListId)
            .then(selectableList => selectableList.selectableListValues)
    }

    getById(selectableListId: string) {
        return this.http.get<SelectableList>(`${this.config.apiUrl}${this.baseSelectableListUrl}/${selectableListId}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}${this.baseSelectableListUrl}/${id}`)
            .toPromise();
    }

    save(template: SelectableList): Promise<SelectableList> {
        return this.http.post<SelectableList>(`${this.config.apiUrl}${this.baseSelectableListUrl}/`, template)
            .toPromise();
    }

    activateDeactivateSelectableList(templateId: string, isActive: boolean): Promise<any> {
        const patchObject = [{
            "op": "add",
            "path": "/isActive",
            "value": isActive
        }];

        return this.http.patch(`${this.config.apiUrl}${this.baseSelectableListUrl}/${templateId}`, patchObject)
            .toPromise();
    }

    getByTitle(title: any, companyId: string = null): Promise<SelectableList> {
        const filter = this.getFirstByTitleAndCompanyIdFilter(title, companyId);
        return this.getByFilter(filter)
            .then(selectableLists => selectableLists[0])
    }

    getByFilter(searchFilter: SelectableListSearchFilter): Promise<SelectableList[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<SelectableList[]>(`${this.config.apiUrl}${this.baseSelectableListUrl}`, { params: queryParams })
            .toPromise();
    }

    private getFirstByTitleAndCompanyIdFilter(title: string, companyId: string = null) {
        const selectableListFilter = new SelectableListSearchFilter();
        selectableListFilter.take = 1;
        selectableListFilter.title = title;

        if (companyId)
            selectableListFilter.companyId = companyId;

        return selectableListFilter;
    }

    protected getFirstByCompanyIdFilter(companyId: string) {
        const selectableListFilter = new SelectableListSearchFilter();
        selectableListFilter.take = 1;
        selectableListFilter.companyId = companyId;

        return selectableListFilter;
    }

    private getFirstByCategoryIdFilter(categoryId: string, companyId: string = null) {
        const selectableListFilter = new SelectableListSearchFilter();
        selectableListFilter.take = 1;
        selectableListFilter.categoryId = categoryId;

        if (companyId)
            selectableListFilter.companyId = companyId;

        return selectableListFilter;
    }

    private getFirstActiveByCategoryIdFilter(categoryId: string, companyId: string = null) {
        const selectableListFilter = new SelectableListSearchFilter();
        selectableListFilter.take = 1;
        selectableListFilter.categoryId = categoryId;
        selectableListFilter.isActive = true;

        if (companyId)
            selectableListFilter.companyId = companyId;

        return selectableListFilter;
    }
}