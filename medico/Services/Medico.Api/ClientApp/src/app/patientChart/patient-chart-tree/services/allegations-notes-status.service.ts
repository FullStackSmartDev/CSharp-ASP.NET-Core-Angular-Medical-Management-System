import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { AllegationsNotesStatus } from '../../models/allegationsNotesStatus';

@Injectable()
export class AllegationsNotesStatusService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    getByAdmissionId(admissionId: string) {
        return this.http.get<AllegationsNotesStatus>(`${this.config.apiUrl}allegationsnotesstatus/admission/${admissionId}`)
            .toPromise();
    }

    save(allegationsNotesStatus: AllegationsNotesStatus) {
        return this.http.post<void>(`${this.config.apiUrl}allegationsnotesstatus`, allegationsNotesStatus)
            .toPromise();
    }
}