import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class PatientDataModelTrackService {
  private _patienDataModelTrackSource = new Subject<boolean>();
 
  patientDataModelChanged = this._patienDataModelTrackSource.asObservable();
 
  emitPatientDataModelChanges(isPatientDataModelChanged:boolean) {
    this._patienDataModelTrackSource.next(isPatientDataModelChanged);
  }
}