import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';

@Injectable({ providedIn: 'root' })
export class DxDataUrlService {
    constructor(private config: ConfigService) {
    }

    getEntityEndpointUrl(entityName: string): string {
        return `${this.config.apiUrl}${entityName}`;
    }

    getGridUrl(entityName: string): string {
        return `${this.config.apiUrl}${entityName}/dx/grid`;
    }

    getLookupUrl(entityName: string): string {
        return `${this.config.apiUrl}${entityName}/dx/lookup`;
    }

    getCompanyRelatedLookupUrl(entityName: string, companyId: string): string {
        return `${this.config.apiUrl}${entityName}/${companyId}/dx/lookup`;
    }
}