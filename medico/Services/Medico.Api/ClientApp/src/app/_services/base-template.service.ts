import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { TemplateSearchFilter } from '../administration/models/TemplateSearchFilter';
import { TemplateGridItem } from 'src/app/_models/templateGridItem';
import { SortableItem } from '../share/classes/sortableItem';
import { Template } from '../_models/template';

export abstract class BaseTemplateService {
    protected abstract baseTemplateUrl: string;

    constructor(protected http: HttpClient,
        protected config: ConfigService) {
    }

    getFirstActiveBySelectableListId(selectableListId: string, companyId: string = null) {
        const firstActiveBySelectableListIdFilter =
            this.getFirstActiveBySelectableListIdFilter(selectableListId, companyId);

        return this.getByFilter(firstActiveBySelectableListIdFilter)
            .then(templateGridItems => {
                return templateGridItems.length
                    ? templateGridItems[0]
                    : null;
            });
    }

    getFirstBySelectableListId(selectableListId: string, companyId: string = null) {
        const firstBySelectableListIdFilter =
            this.getFirstBySelectableListIdFilter(selectableListId, companyId);

        return this.getByFilter(firstBySelectableListIdFilter)
            .then(templateGridItems => {
                return templateGridItems.length
                    ? templateGridItems[0]
                    : null;
            });
    }

    getFirstByExpressionId(expressionId: string, companyId: string = null) {
        const firstByExpressionIdFilter =
            this.getFirstByExpressionIdFilter(expressionId, companyId);

        return this.getByFilter(firstByExpressionIdFilter)
            .then(templateGridItems => {
                return templateGridItems.length
                    ? templateGridItems[0]
                    : null;
            });
    }

    getById(templateId: string) {
        return this.http.get<Template>(`${this.config.apiUrl}${this.baseTemplateUrl}/${templateId}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}${this.baseTemplateUrl}/${id}`)
            .toPromise();
    }

    save(template: Template): Promise<Template> {
        return this.http.post<Template>(`${this.config.apiUrl}${this.baseTemplateUrl}/`, template)
            .toPromise();
    }

    activateDeactivateTemplate(templateId: string, isActive: boolean): Promise<any> {
        const patchObject = [{
            "op": "add",
            "path": "/isActive",
            "value": isActive
        }];

        return this.http.patch(`${this.config.apiUrl}${this.baseTemplateUrl}/${templateId}`, patchObject)
            .toPromise();
    }

    reorderTemplates(sortableItems: SortableItem[]): Promise<any> {
        const patchObject = [];

        for (let i = 0; i < sortableItems.length; i++) {
            const sortableItem = sortableItems[i];
            patchObject.push({
                "op": "add",
                "path": "/templatesOrders/-",
                "value": {
                    "id": sortableItem.id,
                    "order": sortableItem.order
                }
            });
        }

        return this.http.patch(`${this.config.apiUrl}${this.baseTemplateUrl}`, patchObject)
            .toPromise();
    }

    getFirstActiveByTemplateTypeId(libraryTemplateTypeId: string, companyId: string = null) {
        const firstActiveByTemplateTypeIdFilter =
            this.getFirstActiveByTemplateTypeIdFilter(libraryTemplateTypeId, companyId);
        return this.getByFilter(firstActiveByTemplateTypeIdFilter)
            .then(templateGridItems => {
                return templateGridItems.length
                    ? templateGridItems[0]
                    : null;
            });
    }

    getFirstByTemplateTypeId(libraryTemplateTypeId: string, companyId: string = null): Promise<TemplateGridItem> {
        const firstByTemplateTypeIdFilter =
            this.getFirstByTemplateTypeIdFilter(libraryTemplateTypeId, companyId);
        return this.getByFilter(firstByTemplateTypeIdFilter)
            .then(templateGridItems => {
                return templateGridItems.length
                    ? templateGridItems[0]
                    : null;
            });
    }

    getByFilter(searchFilter: TemplateSearchFilter): Promise<TemplateGridItem[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<TemplateGridItem[]>(`${this.config.apiUrl}${this.baseTemplateUrl}`, { params: queryParams })
            .toPromise();
    }

    private getFirstActiveBySelectableListIdFilter(selectableListId: string, companyId: string = null) {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.selectableListId = selectableListId;
        templateFilter.isActive = true;
        templateFilter.take = 1;

        if (companyId)
            templateFilter.companyId = companyId;

        return templateFilter;
    }

    private getFirstByExpressionIdFilter(expressionId: string, companyId: string = null) {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.expressionId = expressionId;
        templateFilter.take = 1;

        if (companyId)
            templateFilter.companyId = companyId;

        return templateFilter;
    }

    private getFirstBySelectableListIdFilter(selectableListId: string, companyId: string = null) {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.selectableListId = selectableListId;
        templateFilter.take = 1;

        if (companyId)
            templateFilter.companyId = companyId;

        return templateFilter;
    }

    private getFirstByTemplateTypeIdFilter(libraryTemplateTypeId: string, companyId: string = null) {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.templateTypeId = libraryTemplateTypeId;
        templateFilter.take = 1;

        if (companyId)
            templateFilter.companyId = companyId;

        return templateFilter;
    }

    private getFirstActiveByTemplateTypeIdFilter(libraryTemplateTypeId: string, companyId: string = null) {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.templateTypeId = libraryTemplateTypeId;
        templateFilter.isActive = true;
        templateFilter.take = 1;

        if (companyId)
            templateFilter.companyId = companyId;

        return templateFilter;
    }
}
