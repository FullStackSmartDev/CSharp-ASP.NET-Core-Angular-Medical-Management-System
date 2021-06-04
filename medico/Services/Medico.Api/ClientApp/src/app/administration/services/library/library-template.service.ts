import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { BaseTemplateService } from 'src/app/_services/base-template.service';


@Injectable()
export class LibraryTemplateService extends BaseTemplateService {
    baseTemplateUrl: string = ApiBaseUrls.libraryTemplates;

    constructor(http: HttpClient,
        config: ConfigService) {
        super(http, config)
    }
}