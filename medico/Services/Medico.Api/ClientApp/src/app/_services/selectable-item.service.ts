import { Injectable } from '@angular/core';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { SelectableItemRequest } from '../_models/selectableItemRequest';

@Injectable({ providedIn: 'root' })
export class SelectableItemService {
    baseTemplateUrl: string = ApiBaseUrls.selectableItems;

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getSelectableHtmlElementString(selectableItemRequest: SelectableItemRequest): Promise<string> {
        const queryParams = new HttpParams({
            fromObject: selectableItemRequest.toQueryParams()
        });

        return this.http.get<any>(`${this.config.apiUrl}${this.baseTemplateUrl}`, { params: queryParams })
            .toPromise()
            .then((response => {
                return response.selectableItemHtmlString;
            }))
    }
}