import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { Admission } from '../models/admission';
import { HttpClient } from '@angular/common/http';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class AdmissionService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    save(admission: Admission): Promise<Admission> {
        return this.http.post<Admission>(`${this.config.apiUrl}admission/`, admission)
            .toPromise();
    }

    getById(id: string): Promise<Admission> {
        return this.http.get<Admission>(`${this.config.apiUrl}admission/${id}`)
            .toPromise()
            .then(admission => {
                if (!admission)
                    return admission;

                admission.createdDate = DateHelper.sqlServerUtcDateToLocalJsDate(admission.createdDate);
                return admission;
            });
    }

    getByAppointmentId(appointmentId: string): Promise<Admission> {
        return this.http.get<Admission>(`${this.config.apiUrl}admission/appointment/${appointmentId}`)
            .toPromise()
            .then(admission => {
                if (!admission)
                    return admission;

                admission.createdDate = DateHelper.sqlServerUtcDateToLocalJsDate(admission.createdDate);
                return admission;
            });
    }

    getPreviousPatientAdmissions(patientId: string, fromDate: any): Promise<Admission[]> {
        const utcServerFromDate = DateHelper.jsLocalDateToSqlServerUtc(fromDate);
        return this.http.get<Admission[]>(`${this.config.apiUrl}admission/previous/patient/${patientId}/date/${utcServerFromDate}`)
            .toPromise();
    }
}