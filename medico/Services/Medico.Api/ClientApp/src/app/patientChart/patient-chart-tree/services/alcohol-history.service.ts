import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { AlcoholHistory } from '../../models/alcoholHistory';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class AlcoholHistoryService {
    constructor(private http: HttpClient, private config: ConfigService) {

    }

    getAllByPatientId(patientId: string) {
        return this.http.get<AlcoholHistory[]>(`${this.config.apiUrl}alcoholhistory/patient/${patientId}`)
            .toPromise();
    }

    getLastCreated(patientId: string): Promise<AlcoholHistory> {
        return this.http.get<AlcoholHistory>(`${this.config.apiUrl}alcoholhistory/last/patient/${patientId}`)
            .toPromise();
    }

    save(alcoholHistory: AlcoholHistory) {
        alcoholHistory.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(alcoholHistory.createDate);

        return this.http.post<void>(`${this.config.apiUrl}alcoholhistory`, alcoholHistory)
            .toPromise();
    }

    delete(alcoholHistoryId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}alcoholhistory/${alcoholHistoryId}`)
            .toPromise();
    }

    getById(alcoholHistoryId: any) {
        return this.http.get<AlcoholHistory>(`${this.config.apiUrl}alcoholhistory/${alcoholHistoryId}`)
            .toPromise()
            .then(alcoholHistory => {
                if (alcoholHistory) {
                    alcoholHistory.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(alcoholHistory.createDate);
                }

                return alcoholHistory;
            });
    }
}