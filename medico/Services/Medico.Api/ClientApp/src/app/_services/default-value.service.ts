import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { DefaultValue } from '../_models/defaultValue';
import { PatientChartNodeType } from '../_models/patientChartNodeType';

@Injectable({ providedIn: 'root' })
export class DefaultValueService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByPatientChartNodeType(patientChartNodeType: PatientChartNodeType) {
        return this.http.get<DefaultValue>(`${this.config.apiUrl}defaultvalue/key/${patientChartNodeType}`)
            .toPromise();
    }
}