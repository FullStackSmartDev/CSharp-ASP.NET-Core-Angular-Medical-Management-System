import { ConfigService } from './config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReferenceTable } from '../administration/models/referenceTable';
import { ImportedItemsSearchFilter } from '../administration/models/importedItemsSearchFilter';
import { ReferenceTableGridItem } from '../administration/models/referenceTableGridItem';

export abstract class BaseReferenceTableService {
    abstract basedReferenceTableUrl: string

    constructor(protected http: HttpClient,
        protected config: ConfigService) {
    }

    getById(id: string): Promise<ReferenceTable> {
        return this.http.get<ReferenceTable>(`${this.config.apiUrl}${this.basedReferenceTableUrl}/${id}`)
            .toPromise();
    }

    save(referenceTable: ReferenceTable): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}${this.basedReferenceTableUrl}`, referenceTable)
            .toPromise();
    }

    getByFilter(searchFilter: ImportedItemsSearchFilter): Promise<ReferenceTableGridItem[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<ReferenceTableGridItem[]>(`${this.config.apiUrl}${this.basedReferenceTableUrl}`, { params: queryParams })
            .toPromise();
    }
}