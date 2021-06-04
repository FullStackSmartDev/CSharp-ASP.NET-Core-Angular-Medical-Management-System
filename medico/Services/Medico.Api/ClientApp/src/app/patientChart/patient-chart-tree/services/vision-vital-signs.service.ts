import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { VisionVitalSigns } from '../../models/visionVitalSigns';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class VisionVitalSignsService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getById(visionVitalSignsId: string): Promise<VisionVitalSigns> {
        return this.http.get<VisionVitalSigns>(`${this.config.apiUrl}visionvitalsigns/${visionVitalSignsId}`)
            .toPromise()
            .then(vitalSigns => {
                if (vitalSigns) {
                    vitalSigns.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(vitalSigns.createDate);
                }

                return vitalSigns;
            });
    }

    save(visionVitalSigns: VisionVitalSigns) {
        visionVitalSigns.createDate = DateHelper.jsLocalDateToSqlServerUtc(visionVitalSigns.createDate);
        return this.http.post<void>(`${this.config.apiUrl}visionvitalsigns`, visionVitalSigns)
            .toPromise();
    }

    getByPatientId(patientId: string): Promise<VisionVitalSigns[]> {
        return this.http.get<VisionVitalSigns[]>(`${this.config.apiUrl}visionvitalsigns/patient/${patientId}`)
            .toPromise();
    }
}