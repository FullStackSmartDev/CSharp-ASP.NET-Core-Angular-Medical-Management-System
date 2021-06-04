import { Injectable } from "@angular/core";
import { IcdCode } from '../_models/icdCode';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class IcdCodeService {
    constructor(private http: HttpClient,
        private config: ConfigService) { }

    checkMappingExistence(icdCodeId: string, keyword: string): Promise<boolean> {
        return this.http.get<boolean>(`${this.config.apiUrl}chiefcomplaintkeyword/icdcode/${icdCodeId}/keyword/${keyword}/existence`)
            .toPromise();
    }

    getById(id: string): Promise<IcdCode> {
        return this.http.get<IcdCode>(`${this.config.apiUrl}icdcode/${id}`)
            .toPromise();
    }

    getMappedToKeword(keyword: string): Promise<IcdCode[]> {
        return this.http.get<IcdCode[]>(`${this.config.apiUrl}icdcode/keyword/${keyword}`)
            .toPromise();
    }

    deleteIcdCodeMapping(keyword: string, icdCodeId: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}chiefcomplaintkeyword/keyword/${keyword}/icdcode/${icdCodeId}`)
            .toPromise();
    }
}