import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { SelectableListCategory } from '../models/selectableListCategory';
import { ISearchableByName } from '../../_interfaces/iSearchableByName';

@Injectable()
export class SelectableListCategoryService implements ISearchableByName {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByName(name: string, companyId: string): Promise<SelectableListCategory> {
        return this.http.get<SelectableListCategory>(`${this.config.apiUrl}selectablelistcategory/name/${name}/company/${companyId}`)
            .toPromise();
    }

    save(room: SelectableListCategory): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}selectablelistcategory/`, room)
            .toPromise();
    }

    getById(id: string): Promise<SelectableListCategory> {
        return this.http.get<SelectableListCategory>(`${this.config.apiUrl}selectablelistcategory/${id}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}selectablelistcategory/${id}`)
            .toPromise();
    }
}