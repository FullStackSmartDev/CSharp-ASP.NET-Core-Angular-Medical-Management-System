import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { SurgicalHistory } from '../../models/surgicalHistory';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class SurgicalHistoryService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<SurgicalHistory[]>(`${this.config.apiUrl}surgicalhistory/patient/${patientId}`)
            .toPromise();
    }

    isHistoryExist(patientId: string) {
        return this.http.get<boolean>(`${this.config.apiUrl}surgicalhistory/historyexistence/patient/${patientId}`)
            .toPromise();
    }

    save(surgicalHistory: SurgicalHistory) {
        return this.http.post<void>(`${this.config.apiUrl}surgicalhistory`, surgicalHistory)
            .toPromise();
    }

    delete(surgicalHistoryId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}surgicalhistory/${surgicalHistoryId}`)
            .toPromise();
    }

    getById(surgicalHistoryId: any) {
        return this.http.get<SurgicalHistory>(`${this.config.apiUrl}surgicalhistory/${surgicalHistoryId}`)
            .toPromise()
            .then(surgicalHistory => {
                if (surgicalHistory) {
                    surgicalHistory.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(surgicalHistory.createDate);
                }

                return surgicalHistory;
            });
    }
}