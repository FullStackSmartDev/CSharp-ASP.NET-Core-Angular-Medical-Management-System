import { ConfigService } from './config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LookupModel } from '../_models/lookupModel';
import { CreateUpdateExpressionModel } from '../_models/createUpdateExpressionModel';
import { ExpressionModel } from '../_models/expressionModel';
import { ImportedItemsSearchFilter } from '../administration/models/importedItemsSearchFilter';
import { ExpressionGridItemModel } from '../_models/expressionGridItemModel';

export abstract class BaseExpressionService {
    protected abstract baseExpressionUrl: string;

    constructor(protected http: HttpClient,
        protected config: ConfigService) { }

    getById(expressionId: string): Promise<ExpressionModel> {
        return this.http.get<ExpressionModel>(`${this.config.apiUrl}${this.baseExpressionUrl}/${expressionId}`)
            .toPromise();
    }

    getExpressionReferenceTables(expressionId: string): Promise<LookupModel[]> {
        return this.http.get<LookupModel[]>(`${this.fullExpressionUrl}${expressionId}/reference-tables`)
            .toPromise();
    }

    save(expression: CreateUpdateExpressionModel): Promise<CreateUpdateExpressionModel> {
        return this.http.post<CreateUpdateExpressionModel>(`${this.config.apiUrl}${this.baseExpressionUrl}/`, expression)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}${this.baseExpressionUrl}/${id}`)
            .toPromise();
    }

    getByFilter(searchFilter: ImportedItemsSearchFilter): Promise<ExpressionGridItemModel[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<ExpressionGridItemModel[]>(`${this.config.apiUrl}${this.baseExpressionUrl}`, { params: queryParams })
            .toPromise();
    }

    protected get fullExpressionUrl(): string {
        return `${this.config.apiUrl}${this.baseExpressionUrl}/`;
    }
}