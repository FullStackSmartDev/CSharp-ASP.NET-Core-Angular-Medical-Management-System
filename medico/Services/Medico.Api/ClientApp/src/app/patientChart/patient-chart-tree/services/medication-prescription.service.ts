import { Injectable } from '@angular/core';
import { MedicationPrescription } from '../../models/medicationPrescription';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { DateHelper } from 'src/app/_helpers/date.helper';

@Injectable()
export class MedicationPrescriptionService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getByAdmissionId(admissionId: string): Promise<MedicationPrescription[]> {
        return this.http.get<MedicationPrescription[]>(`${this.config.apiUrl}prescription/admission/${admissionId}`)
            .toPromise();
    }

    save(medicationPrescription: MedicationPrescription): Promise<void> {
        medicationPrescription.startDate = DateHelper
            .jsLocalDateToSqlServerUtc(medicationPrescription.startDate);

        medicationPrescription.endDate = DateHelper
            .jsLocalDateToSqlServerUtc(medicationPrescription.endDate);

        return this.http.post<void>(`${this.config.apiUrl}prescription`, medicationPrescription)
            .toPromise();
    }

    getById(prescriptionId: string): Promise<MedicationPrescription> {
        return this.http.get<MedicationPrescription>(`${this.config.apiUrl}prescription/${prescriptionId}`)
            .toPromise()
            .then(prescription => {
                if (prescription) {
                    prescription.startDate = DateHelper.sqlServerUtcDateToLocalJsDate(prescription.startDate);
                    prescription.endDate = DateHelper.sqlServerUtcDateToLocalJsDate(prescription.endDate);
                }

                return prescription;
            });
    }

    isPrescriptionExist(admissionId: string): Promise<boolean> {
        return this.http.get<boolean>(`${this.config.apiUrl}prescription/existence/admission/${admissionId}`)
            .toPromise();
    }

    delete(medicationPrescriptionId: any): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}prescription/${medicationPrescriptionId}`)
            .toPromise();
    }

}