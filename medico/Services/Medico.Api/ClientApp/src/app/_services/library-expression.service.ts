import { BaseExpressionService } from './base-expression.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: "root" })
export class LibraryExpressionService extends BaseExpressionService {
    protected baseExpressionUrl: string = ApiBaseUrls.libraryExpressions;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }
}