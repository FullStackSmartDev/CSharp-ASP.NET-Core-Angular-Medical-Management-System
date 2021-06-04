import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { SelectableListTrackItem } from '../models/selectable-list-track-item';

@Injectable()
export class SelectableListTrackService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    update(templateId: string, detailedTemplateContent: string, companyId: string): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}selectablelist/trackitem`, { templateId, detailedTemplateContent, companyId })
            .toPromise();
    }

    getSelectableListId(selectableListid: string): Promise<SelectableListTrackItem> {
        return this.http.get<SelectableListTrackItem>(`${this.config.apiUrl}selectablelist/trackitem/${selectableListid}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}selectablelisttrack/${id}`)
            .toPromise();
    }
}