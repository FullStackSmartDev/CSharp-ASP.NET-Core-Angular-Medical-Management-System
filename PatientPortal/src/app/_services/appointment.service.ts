import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { Appointment } from '../_models/appointment';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { AppointmentGridItem } from '../scheduler/models/appointmentGridItem';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByAdmissionId(admissionId: string): Promise<Appointment> {
        return this.http.get<Appointment>(`${this.config.apiUrl}appointment/admission/${admissionId}`)
            .toPromise()
            .then(appointment => {
                if (appointment) {
                    appointment.startDate = DateHelper.sqlServerUtcDateToLocalJsDate(appointment.startDate);
                    appointment.endDate = DateHelper.sqlServerUtcDateToLocalJsDate(appointment.endDate);
                }

                return appointment;
            })
    }

    getAppointmentGridItemById(appointmentId: string): Promise<AppointmentGridItem> {
        return this.http.get<AppointmentGridItem>(`${this.config.apiUrl}appointment/griditem/${appointmentId}`)
            .toPromise();
    }

    getByUserId(userId: string) {
        const url = `${this.config.apiUrl}appointment/user/${userId}`
        return this.http.get<Appointment>(url)
            .toPromise();
    }

    getPatientPreviousVisits(patientId: string, startDate: any): Promise<Appointment[]> {
        const utcDate = DateHelper.jsLocalDateToSqlServerUtc(startDate);

        const url = `${this.config.apiUrl}appointment/previous/${patientId}/date/${utcDate}`
        return this.http.get<Appointment[]>(url).toPromise();
    }

    getPatientLastVisit(patientId: string, startDate: any): Promise<Appointment> {
        const utcDate = DateHelper.jsLocalDateToSqlServerUtc(startDate);

        const url = `${this.config.apiUrl}appointment/last/patient/${patientId}/date/${utcDate}`
        return this.http.get<Appointment>(url).toPromise();
    }

    getByLocationId(locationId: string): Promise<Appointment> {
        const url = `${this.config.apiUrl}appointment/location/${locationId}`
        return this.http.get<Appointment>(url)
            .toPromise();
    }

    getByRoomId(roomId: string) {
        const url = `${this.config.apiUrl}appointment/room/${roomId}`
        return this.http.get<Appointment>(url)
            .toPromise();
    }

    save(appointment: Appointment): Promise<Appointment> {
        return this.http.post<Appointment>(`${this.config.apiUrl}appointment/`, appointment)
            .toPromise();
    }

    getById(id: string): Promise<Appointment> {
        return this.http.get<Appointment>(`${this.config.apiUrl}appointment/${id}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}appointment/${id}`)
            .toPromise();
    }
}