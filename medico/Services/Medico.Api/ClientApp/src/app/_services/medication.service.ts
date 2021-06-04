import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { LookupModel } from '../_models/lookupModel';
import { MedicationItemInfoView } from '../patientChart/models/medicationItemInfoView';
import { MedicationItemInfo } from '../patientChart/models/medicationItemInfo';
import { MedicationConfigurationExistence } from '../patientChart/models/medicationConfigurationExistence';

@Injectable({ providedIn: 'root' })
export class MedicationService {
    constructor(private http: HttpClient,
        private config: ConfigService) { }

    getMedicationInfo(medicationNameId: string): Promise<MedicationItemInfoView> {
        return this.http.get<MedicationItemInfoView>(`${this.config.apiUrl}medication/info/${medicationNameId}`)
            .toPromise();
    }

    getById(id: string): Promise<LookupModel> {
        return this.http.get<LookupModel>(`${this.config.apiUrl}medication/${id}`)
            .toPromise();
    }

    getNameByMedicationNameId(medicationNameId: string): Promise<LookupModel> {
        return this.http.get<LookupModel>(`${this.config.apiUrl}medication/name/${medicationNameId}`)
            .toPromise();
    }

    getMedicationConfigurationExistence(medicationItemInfo: MedicationItemInfo): Promise<MedicationConfigurationExistence>{
        return this.http.post<MedicationConfigurationExistence>(`${this.config.apiUrl}medication/configuration/existence`, medicationItemInfo)
            .toPromise();
    }
}