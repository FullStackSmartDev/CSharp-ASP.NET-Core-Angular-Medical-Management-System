import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientChartTrackService {
    private _patienChartTrackSource = new Subject<boolean>();

    patientChartChanged = this._patienChartTrackSource.asObservable();

    emitPatientChartChanges(isPatientChartChanged: boolean) {
        this._patienChartTrackSource.next(isPatientChartChanged);
    }
}