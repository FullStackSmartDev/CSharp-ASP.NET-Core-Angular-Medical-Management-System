import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { ISearchableByName } from '../_interfaces/iSearchableByName';
import { ChiefComplaint } from 'src/app/_models/chiefComplaint';
import { Template } from '../_models/template';
import { ChiefComplaintKeyword } from '../_models/chiefComplaintKeyword';
import { ChiefComplaintWithKeywords } from 'src/app/_models/chiefComplaintWithKeywords';

@Injectable({ providedIn: 'root' })
export class ChiefComplaintService implements ISearchableByName {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getWithKeywords(companyId: string) {
        return this.http
            .get<ChiefComplaintWithKeywords[]>(`${this.config.apiUrl}chiefcomplaint/keywords/company/${companyId}`)
            .toPromise();
    }

    getByName(name: string, companyId: string): Promise<ChiefComplaint> {
        return this.http.get<ChiefComplaint>(`${this.config.apiUrl}chiefcomplaint/name/${name}/company/${companyId}`)
            .toPromise();
    }

    getById(id: string): Promise<ChiefComplaint> {
        return this.http.get<ChiefComplaint>(`${this.config.apiUrl}chiefcomplaint/${id}`)
            .toPromise();
    }

    save(chiefComplaint: ChiefComplaint): Promise<ChiefComplaint> {
        return this.http.post<ChiefComplaint>(`${this.config.apiUrl}chiefcomplaint/`, chiefComplaint)
            .toPromise();
    }

    getChiefComplaintTemplatesByType(chiefComplaintId: string, templateTypeId: string): Promise<Template[]> {
        return this.http.get<Template[]>(`${this.config.apiUrl}chiefcomplaint/${chiefComplaintId}/templatetype/${templateTypeId}`)
            .toPromise();
    }

    getChiefComplaintKeywords(chiefComplaintId: string): Promise<ChiefComplaintKeyword[]> {
        return this.http.get<ChiefComplaintKeyword[]>(`${this.config.apiUrl}chiefcomplaint/${chiefComplaintId}/keyword`)
            .toPromise();
    }

    saveChiefComplaintTemplates(chiefComplaintId: string, templateIds: string[]): Promise<any> {
        return this.http.post<void>(`${this.config.apiUrl}chiefcomplaint/${chiefComplaintId}/template`, templateIds)
            .toPromise();
    }

    saveChiefComplaintKeywords(chiefComplaintId: string, keywords: string[]): Promise<any> {
        return this.http.post<void>(`${this.config.apiUrl}chiefcomplaint/${chiefComplaintId}/keyword`, keywords)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}chiefcomplaint/${id}`)
            .toPromise();
    }
}