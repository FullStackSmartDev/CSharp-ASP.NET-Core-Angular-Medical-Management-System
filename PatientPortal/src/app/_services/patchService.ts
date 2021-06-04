import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';

@Injectable({ providedIn: 'root' })
export class PatchService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    updateTemplatesSelectableTrackItems(comppanyId: string): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}patch/selectablelist/trackitem/${comppanyId}`, {})
            .toPromise();
    }

    updateTemplatesSelectableItemsMetadataSeparators(companyId: string): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}patch/template`, { companyId: companyId, separator: "::" })
            .toPromise();
    }
}