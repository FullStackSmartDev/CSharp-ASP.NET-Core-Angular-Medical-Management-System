import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { ISearchableByName } from '../_interfaces/iSearchableByName';
import { Template } from '../_models/template';
import { TemplateWithTypeName } from '../_models/templateWithTypeName';

@Injectable({ providedIn: 'root' })
export class TemplateService implements ISearchableByName {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getAllByCompanyId(companyId: string): Promise<Template[]> {
        return this.http.get<Template[]>(`${this.config.apiUrl}template/company/${companyId}`)
            .toPromise();
    }

    getChiefComplaintTemplates(chiefComplaintId: string): Promise<Template[]> {
        return this.http.get<Template[]>(`${this.config.apiUrl}template/chiefcomplaint/${chiefComplaintId}`)
            .toPromise();
    }

    getRequiredTemplates(companyId: string): Promise<TemplateWithTypeName[]> {
        return this.http.get<TemplateWithTypeName[]>(`${this.config.apiUrl}template/${companyId}/required`)
            .toPromise();
    }

    countByTemplateType(templateTypeId: string): Promise<number> {
        return this.http.get<number>(`${this.config.apiUrl}template/templatetype/${templateTypeId}/count`)
            .toPromise();
    }

    batchUpdate(templates: Template[]) {
        return this.http.post<void>(`${this.config.apiUrl}template/batch`, templates)
            .toPromise();
    }

    getByName(name: string, companyId: string): Promise<Template> {
        return this.http.get<Template>(`${this.config.apiUrl}template/name/${name}/company/${companyId}`)
            .toPromise();
    }

    getById(id: string): Promise<Template> {
        return this.http.get<Template>(`${this.config.apiUrl}template/${id}`)
            .toPromise();
    }

    getByTemplateTypeId(templateTypeId: string): Promise<Template[]> {
        return this.http.get<Template[]>(`${this.config.apiUrl}template/templatetype/${templateTypeId}`)
            .toPromise();
    }

    save(template: Template): Promise<Template> {
        return this.http.post<Template>(`${this.config.apiUrl}template/`, template)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}template/${id}`)
            .toPromise();
    }
}