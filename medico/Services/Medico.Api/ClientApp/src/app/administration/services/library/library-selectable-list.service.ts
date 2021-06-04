import { Injectable } from '@angular/core';
import { BaseSelectableListService } from 'src/app/_services/base-selectable-list.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LibrarySelectableListService extends BaseSelectableListService {
    baseSelectableListUrl: string = ApiBaseUrls.librarySelectableList;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);    
    }
}