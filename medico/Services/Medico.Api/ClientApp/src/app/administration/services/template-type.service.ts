import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { BaseTemplateTypeService } from 'src/app/_services/base-template-type.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { TemplateTypeSearchFilter } from '../models/templateTypeSearchFilter';
import { TemplateType } from 'src/app/_models/templateType';

@Injectable()
export class TemplateTypeService extends BaseTemplateTypeService {
    basedTemplateTypeUrl: string = ApiBaseUrls.templateTypes;

    constructor(http: HttpClient,
        config: ConfigService) {
        super(http, config);
    }

    getByCompanyId(companyId: string): Promise<TemplateType[]> {
        const searchFilter = new TemplateTypeSearchFilter();
        searchFilter.companyId = companyId;

        return this.getByFilter(searchFilter)
    };
}