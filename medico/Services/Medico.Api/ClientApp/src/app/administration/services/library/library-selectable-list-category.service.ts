import { Injectable } from '@angular/core';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { BaseSelectableListCategoryService } from 'src/app/_services/base-selectable-list-category.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';

@Injectable()
export class LibrarySelectableListCategoryService extends BaseSelectableListCategoryService {
    basedCategoryUrl: string = ApiBaseUrls.librarySelectableListCategory;

    constructor(http: HttpClient,
        config: ConfigService) {
        super(http, config);
    }
}