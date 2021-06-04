import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PatientChartNodeType } from '../_models/patientChartNodeType';

@Injectable({ providedIn: 'root' })
export class PatientChartTrackService {
    private _patienChartTrackSource = new Subject<PatientChartNodeType>();

    patientChartChanged = this._patienChartTrackSource.asObservable();

    emitPatientChartChanges(patientChartNodeType: PatientChartNodeType) {
        this._patienChartTrackSource.next(patientChartNodeType);
    }
}