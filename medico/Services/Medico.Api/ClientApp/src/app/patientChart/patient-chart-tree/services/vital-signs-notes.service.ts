import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { VitalSignsNotes } from '../../models/vitalSignsNotes';

@Injectable()
export class VitalSignsNotesService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    save(vitalSignsNotes: VitalSignsNotes) {
        return this.http.post<VitalSignsNotes>(`${this.config.apiUrl}vitalsignsnotes`, vitalSignsNotes)
            .toPromise();
    }

    getByAdmissionId(admissionId: string) {
        return this.http.get<VitalSignsNotes>(`${this.config.apiUrl}vitalsignsnotes/admission/${admissionId}`)
            .toPromise();
    }
}