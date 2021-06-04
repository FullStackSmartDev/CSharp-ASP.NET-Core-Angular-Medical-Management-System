import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyIdService {
    private _companyId: BehaviorSubject<string>;
    public companyId: Observable<string>;

    constructor() {
        this._companyId = new BehaviorSubject("");
        this.companyId = this._companyId.asObservable();
    }

    get companyIdValue(): string {
        return this._companyId.value;
    }

    setCompanyId(companyId: string): void {
        this._companyId.next(companyId);
    }
}