import { BasePatientChartDocumentService } from './base-patient-chart-document.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { Injectable } from '@angular/core';
import { PatientChartNode } from '../_models/patientChartNode';
import { PatientChartDocumentWithVersion } from '../_models/patientChartDocumentWithVersion';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: "root" })
export class PatientChartDocumentService extends BasePatientChartDocumentService {
    patientChartDocumentUrl: string = ApiBaseUrls.patientChartDocuments;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }

    getByIdWithFilter(id: string): Promise<PatientChartDocumentWithVersion> {
        return this.http.get<PatientChartDocumentWithVersion>(`${this.config.apiUrl}${this.patientChartDocumentUrl}/${id}`)
            .toPromise();
    }

    syncWithLibraryDocument(id: string,
        version: number | null, patientChartRootId: string) {
        const patchObject = [];

        if (!version)
            version = 1;

        patchObject.push({
            "op": "add",
            "path": "/version",
            "value": version
        });

        patchObject.push({
            "op": "add",
            "path": "/patientChartRootNodeId",
            "value": patientChartRootId
        });

        return this.http.patch(`${this.config.apiUrl}${this.patientChartDocumentUrl}/${id}/version`, patchObject)
            .toPromise();
    }

    importLibraryDocumentNodes(companyId: string,
        selectedListsIds: string[], patientChartRootNodeId: string): Promise<PatientChartNode[]> {
        const patchObject = [];

        patchObject.push({
            "op": "add",
            "path": "/companyId",
            "value": companyId
        });

        patchObject.push({
            "op": "add",
            "path": "/patientChartRootNodeId",
            "value": patientChartRootNodeId
        });

        for (let i = 0; i < selectedListsIds.length; i++) {
            const libraryListId = selectedListsIds[i];
            patchObject.push({
                "op": "add",
                "path": "/libraryEntityIds/-",
                "value": libraryListId
            });
        }

        return this.http.patch<PatientChartNode[]>(`${this.config.apiUrl}${this.patientChartDocumentUrl}/imported-documents`, patchObject)
            .toPromise();
    }
}