import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { BaseReferenceTableService } from './base-reference-table.service';

@Injectable({ providedIn: "root" })
export class LibraryReferenceTableService extends BaseReferenceTableService {
    basedReferenceTableUrl: string = ApiBaseUrls.libraryReferenceTables;

    constructor(http: HttpClient,
        config: ConfigService) {
        super(http, config);
    }
}