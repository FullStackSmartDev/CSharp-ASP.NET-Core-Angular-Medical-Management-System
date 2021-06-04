import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { MedicoApplicationUser } from '../models/medicoApplicationUser';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { EntityExistenceModel } from '../models/entityExistenceModel';
import { LookupModel } from 'src/app/_models/lookupModel';

@Injectable()
export class UserService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    save(user: MedicoApplicationUser): Promise<void> {
        user.dateOfBirth = DateHelper
            .jsLocalDateToSqlServerUtc(user.dateOfBirth);

        return this.http.post<void>(`${this.config.apiUrl}user/`, user)
            .toPromise();
    }

    getById(id: string): Promise<MedicoApplicationUser> {
        return this.http.get<MedicoApplicationUser>(`${this.config.apiUrl}user/${id}`)
            .toPromise()
            .then(user => {
                user.dateOfBirth = DateHelper.sqlServerUtcDateToLocalJsDate(user.dateOfBirth);
                return user;
            })
    }

    getUserExistence(email: string): Promise<EntityExistenceModel> {
        return this.http.get<EntityExistenceModel>(`${this.config.apiUrl}user/email/${email}`)
            .toPromise();
    }

    getUserCompanies(email: string): Promise<LookupModel[]> {
        return this.http.get<LookupModel[]>(`${this.config.apiUrl}user/companies/email/${email}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}user/${id}`)
            .toPromise();
    }
}