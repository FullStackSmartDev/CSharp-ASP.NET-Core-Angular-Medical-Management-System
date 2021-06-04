import { Injectable } from '@angular/core';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ExpressionItemService {
    baseExpressionItemUrl: string = ApiBaseUrls.expressionItems;

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getExpressionHtmlElementString(expressionId: string): Promise<string> {
        return this.http.get<any>(`${this.config.apiUrl}${this.baseExpressionItemUrl}/${expressionId}`)
            .toPromise()
            .then((response => {
                return response.expressionItemHtmlString;
            }))
    }
}