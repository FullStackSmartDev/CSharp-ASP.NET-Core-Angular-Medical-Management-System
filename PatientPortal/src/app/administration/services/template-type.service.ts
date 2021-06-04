import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { TemplateType } from '../models/templateType';
import { ISearchableByName } from '../../_interfaces/iSearchableByName';
import { LookupModel } from 'src/app/_models/lookupModel';

@Injectable()
export class TemplateTypeService implements ISearchableByName {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByCompanyId(companyId: string): Promise<LookupModel[]> {
        return this.http.get<LookupModel[]>(`${this.config.apiUrl}templatetype/company/${companyId}`)
            .toPromise();
    }

    getByName(name: string, companyId: string): Promise<TemplateType> {
        return this.http.get<TemplateType>(`${this.config.apiUrl}templatetype/name/${name}/company/${companyId}`)
            .toPromise();
    }

    getById(id: string): Promise<TemplateType> {
        return this.http.get<TemplateType>(`${this.config.apiUrl}templatetype/${id}`)
            .toPromise();
    }

    save(templateType: TemplateType): Promise<any> {
        return this.http.post<void>(`${this.config.apiUrl}templatetype/`, templateType)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}templatetype/${id}`)
            .toPromise();
    }
}