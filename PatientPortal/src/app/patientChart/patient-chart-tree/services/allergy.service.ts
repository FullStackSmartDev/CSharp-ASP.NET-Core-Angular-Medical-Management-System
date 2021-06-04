import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { Allergy } from '../../models/allergy';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { AllergyOnMedication } from '../../models/allergyOnMedication';

@Injectable()
export class AllergyService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getPatientAllergyOnMedication(patientId: string, medicationNameId: string): Promise<AllergyOnMedication> {
        return this.http.get<AllergyOnMedication>(`${this.config.apiUrl}allergy/patient/${patientId}/medication/${medicationNameId}`)
            .toPromise();
    }

    getAllByPatientId(patientId: string) {
        return this.http.get<Allergy[]>(`${this.config.apiUrl}allergy/patient/${patientId}`)
            .toPromise();
    }

    isHistoryExist(patientId: string) {
        return this.http.get<boolean>(`${this.config.apiUrl}allergy/allergyexistence/patient/${patientId}`)
            .toPromise();
    }

    save(allergy: Allergy) {
        allergy.createDate = DateHelper
            .jsLocalDateToSqlServerUtc(allergy.createDate);

        return this.http.post<void>(`${this.config.apiUrl}allergy`, allergy)
            .toPromise();
    }

    delete(allergyId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}allergy/${allergyId}`)
            .toPromise();
    }

    getByPatientIdAndDate(patientId: string, currentDate: any): Promise<Allergy[]> {
        var utcDate = DateHelper.jsLocalDateToSqlServerUtc(currentDate);
        return this.http.get<Allergy[]>(`${this.config.apiUrl}allergy/patient/${patientId}/date/${utcDate}`)
            .toPromise()
            .then(allergies => {
                if (allergies.length) {
                    allergies.forEach(allergy => {
                        allergy.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(allergy.createDate);
                    });
                }

                return allergies;
            });
    }

    getById(allergyId: any) {
        return this.http.get<Allergy>(`${this.config.apiUrl}allergy/${allergyId}`)
            .toPromise()
            .then(allergy => {
                if (allergy) {
                    allergy.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(allergy.createDate);
                }

                return allergy;
            });
    }
}