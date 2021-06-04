import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ChiefComplaintKeyword } from '../_models/chiefComplaintKeyword';
import { ChiefComplaintKeywordInfo } from '../_models/ChiefComplaintKeywordInfo';

@Injectable({ providedIn: 'root' })
export class ChiefComplaintKeywordService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByValue(value: string): Promise<ChiefComplaintKeyword> {
        return this.http.get<ChiefComplaintKeyword>(`${this.config.apiUrl}chiefcomplaintkeyword/${value}`)
            .toPromise();
    }

    createIcdCodeMap(keywordValue: string, icdCodeId: string): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}chiefcomplaintkeyword/icdcode/mapping`, { keywordValue: keywordValue, icdCodeId: icdCodeId })
            .toPromise();
    }

    addKeywords(chiefComplaintId: string, keywords: any[]): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}chiefcomplaint/keywords`, { keywords: keywords, chiefComplaintId: chiefComplaintId })
            .toPromise();
    }

    getByIcdCode(icdCodeId: string): Promise<ChiefComplaintKeyword[]> {
        return this.http.get<ChiefComplaintKeyword[]>(`${this.config.apiUrl}chiefcomplaintkeyword/icdcode/${icdCodeId}`)
            .toPromise();
    }

    getByKeywords(keywords: string[], companyId: string): Promise<ChiefComplaintKeywordInfo[]> {
        if (!keywords.length)
            return Promise.resolve([]);

        let url = `${this.config.apiUrl}chiefcomplaintkeyword/company/${companyId}/keywords?keywords=${keywords[0]}`
        if (keywords.length > 1) {
            for (let i = 1; i < keywords.length; i++) {
                const keyword = keywords[i];
                url += `&keywords=${keyword}`
            }
        }

        return this.http.get<ChiefComplaintKeywordInfo[]>(url).toPromise();
    }

    deleteIcdCodeMap(keywordId: string, icdCodeId: string) {
        return this.http.delete<ChiefComplaintKeyword[]>(`${this.config.apiUrl}chiefcomplaintkeyword/${keywordId}/icdcode/${icdCodeId}`)
            .toPromise();
    }
}