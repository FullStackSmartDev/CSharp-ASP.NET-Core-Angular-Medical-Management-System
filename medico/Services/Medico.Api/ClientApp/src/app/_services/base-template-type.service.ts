import { TemplateTypeSearchFilter } from '../administration/models/templateTypeSearchFilter';
import { TemplateType } from '../_models/templateType';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

export abstract class BaseTemplateTypeService {
    protected abstract basedTemplateTypeUrl: string;

    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    activateDeactivateTemplateType(templateTypeId: string, isActive: boolean): Promise<any> {
        const patchObject = [{
            "op": "add",
            "path": "/isActive",
            "value": isActive
        }];

        return this.http.patch(`${this.config.apiUrl}${this.basedTemplateTypeUrl}/${templateTypeId}`, patchObject)
            .toPromise();
    }

    getByName(templateTypeName: string, companyId: string = null): Promise<TemplateType | null> {
        const templateTypeNameFilter =
            this.getTemplateTypeNameFilter(templateTypeName, companyId);

        return this.getByFilter(templateTypeNameFilter)
            .then(templateTypes => {
                return templateTypes.length
                    ? templateTypes[0]
                    : null;
            });
    }

    getById(id: string): Promise<TemplateType> {
        return this.http.get<TemplateType>(`${this.config.apiUrl}${this.basedTemplateTypeUrl}/${id}`)
            .toPromise();
    }

    getByTemplateId(templateId: string, companyId: string = null): Promise<TemplateType> {
        const templateIdFilter =
            this.getByTemplateIdFilter(templateId, companyId);

        return this.getByFilter(templateIdFilter)
            .then(templateTypes => {
                return templateTypes.length
                    ? templateTypes[0]
                    : null;
            });
    }

    save(templateType: TemplateType): Promise<any> {
        return this.http.post<void>(`${this.config.apiUrl}${this.basedTemplateTypeUrl}`, templateType)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}${this.basedTemplateTypeUrl}/${id}`)
            .toPromise();
    }

    protected getByFilter(searchFilter: TemplateTypeSearchFilter): Promise<TemplateType[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<TemplateType[]>(`${this.config.apiUrl}${this.basedTemplateTypeUrl}`, { params: queryParams })
            .toPromise();
    }

    private getTemplateTypeNameFilter(templateTypeGeneratedName: string, companyId: string = null) {
        const searchFilter = new TemplateTypeSearchFilter();
        searchFilter.name = templateTypeGeneratedName;
        searchFilter.take = 1;

        if (companyId)
            searchFilter.companyId = companyId;

        return searchFilter;
    }

    private getByTemplateIdFilter(templateId: string, companyId: string) {
        const searchFilter = new TemplateTypeSearchFilter();
        searchFilter.templateId = templateId;
        searchFilter.take = 1;

        if (companyId)
            searchFilter.companyId = companyId;

        return searchFilter;
    }
}