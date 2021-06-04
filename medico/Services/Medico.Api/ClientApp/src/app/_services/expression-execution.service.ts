import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { ExpressionExecutionRequest } from '../_models/expression-execution-request';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExpressionExecutionService {
    constructor(private http: HttpClient,
        private config: ConfigService) { }

    calculateExpressionsInTemplate(expressionExecutionRequest: ExpressionExecutionRequest): Promise<string> {
        return this.http.post(`${this.config.apiUrl}${ApiBaseUrls.expressionExecutionRequests}/`, expressionExecutionRequest)
            .pipe(map(response => {
                return response["expressionResult"];
            }))
            .toPromise();
    }

    calculateExpression(expressionExecutionRequest: ExpressionExecutionRequest): Promise<string> {
        return this.http.post(`${this.config.apiUrl}${ApiBaseUrls.expressionExecutionRequests}/calculation-result`, expressionExecutionRequest)
            .pipe(map(response => {
                return response["expressionResult"];
            }))
            .toPromise();
    }
}