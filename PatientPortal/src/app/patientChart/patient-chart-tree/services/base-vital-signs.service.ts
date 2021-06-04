import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { BaseVitalSigns } from '../../models/baseVitalSigns';

@Injectable()
export class BaseVitalSignsService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    save(baseVitalSigns: BaseVitalSigns): Promise<BaseVitalSigns> {
        return this.http.post<BaseVitalSigns>(`${this.config.apiUrl}basevitalsigns`, baseVitalSigns)
            .toPromise();
    }

    getByPatientId(patientId: string) {
        return this.http.get<BaseVitalSigns>(`${this.config.apiUrl}basevitalsigns/patient/${patientId}`)
            .toPromise();
    }
}