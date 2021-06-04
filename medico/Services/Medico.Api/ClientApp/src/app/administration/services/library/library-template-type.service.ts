import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { BaseTemplateTypeService } from 'src/app/_services/base-template-type.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';

@Injectable()
export class LibraryTemplateTypeService extends BaseTemplateTypeService {
    protected basedTemplateTypeUrl: string = ApiBaseUrls.libraryTemplateTypes;
    
    constructor(http: HttpClient,
        config: ConfigService) {
        super(http, config);
    }
}