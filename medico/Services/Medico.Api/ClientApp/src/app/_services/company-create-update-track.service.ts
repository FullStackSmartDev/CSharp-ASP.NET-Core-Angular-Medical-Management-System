import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GuidHelper } from '../_helpers/guid.helper';


@Injectable({ providedIn: 'root' })
export class CompanyCreateUpdateTrackService {
    private companyChangesSubject: BehaviorSubject<string>;

    companyChanges: Observable<string>;

    constructor() {
        this.companyChangesSubject = new BehaviorSubject<string>(GuidHelper.emptyGuid);
        this.companyChanges = this.companyChangesSubject.asObservable();
    }

    emitCompanyChanges(companyId: string): void {
        this.companyChangesSubject.next(companyId);
    }
}