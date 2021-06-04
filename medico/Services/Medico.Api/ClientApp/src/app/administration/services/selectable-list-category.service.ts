import { Injectable } from '@angular/core';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { BaseSelectableListCategoryService } from 'src/app/_services/base-selectable-list-category.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';

@Injectable()
export class SelectableListCategoryService extends BaseSelectableListCategoryService {
    basedCategoryUrl: string = ApiBaseUrls.selectableListCategory;

    constructor(http: HttpClient,
        config: ConfigService) {
        super(http, config);
    }
}