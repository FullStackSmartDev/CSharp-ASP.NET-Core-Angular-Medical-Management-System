import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { BaseTemplateService } from './base-template.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { TemplateSearchFilter } from '../administration/models/TemplateSearchFilter';
import { TemplateGridItem } from '../_models/templateGridItem';

@Injectable({ providedIn: 'root' })
export class TemplateService extends BaseTemplateService {
    baseTemplateUrl: string = ApiBaseUrls.templates;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }

    importLibraryTemplates(companyId: string,
        libraryTemplateTypeId: string,
        libraryTemplateIds: string[]) {
        const patchObject = [];

        patchObject.push({
            "op": "add",
            "path": "/companyId",
            "value": companyId
        });

        patchObject.push({
            "op": "add",
            "path": "/libraryTemplateTypeId",
            "value": libraryTemplateTypeId
        });

        for (let i = 0; i < libraryTemplateIds.length; i++) {
            const libraryTemplateId = libraryTemplateIds[i];
            patchObject.push({
                "op": "add",
                "path": "/libraryEntityIds/-",
                "value": libraryTemplateId
            });
        }

        return this.http.patch(`${this.config.apiUrl}${this.baseTemplateUrl}/imported-templates`, patchObject)
            .toPromise();
    }

    syncWithLibraryTemplate(id: string, version: number) {
        const patchObject = [];

        patchObject.push({
            "op": "add",
            "path": "/version",
            "value": version
        });

        return this.http.patch(`${this.config.apiUrl}${this.baseTemplateUrl}/${id}/version`, patchObject)
            .toPromise();
    }

    getChiefComplaintTemplates(chiefComplaintId: string, companyId: string): Promise<TemplateGridItem[]> {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.chiefComplaintId = chiefComplaintId;
        templateFilter.companyId = companyId;

        return this.getByFilter(templateFilter)
    }

    getRequiredTemplates(companyId: string): Promise<TemplateGridItem[]> {
        const templateFilter = new TemplateSearchFilter();
        templateFilter.isRequired = true;
        templateFilter.isActive = true;
        templateFilter.companyId = companyId;

        return this.getByFilter(templateFilter)

    }
}