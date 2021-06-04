import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ValidationResult } from '../_models/validationResult';


@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    resetPassword(email: string, password: string): Promise<boolean> {
        return this.http.post<any>(`${this.config.apiUrl}account/password/resetresult`, { email, password })
            .toPromise();
    }

    checkPassword(email: string, password: string): Promise<boolean> {
        return this.http.post<any>(`${this.config.apiUrl}account/password`, { email, password })
            .toPromise();
    }

    checkPasswordComplexity(userPassword: string): Promise<ValidationResult> {
        return this.http.get<ValidationResult>(`${this.config.apiUrl}account/password/${userPassword}`)
            .toPromise();
    }

    checkEmailExistance(userEmail: string, companyId: string): Promise<ValidationResult> {
        return this.http.get<ValidationResult>(`${this.config.apiUrl}account/email/${userEmail}/company/${companyId}`)
            .toPromise();
    }
}