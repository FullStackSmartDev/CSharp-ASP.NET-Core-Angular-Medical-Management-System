import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { ConfigService } from './config.service';
import { ApplicationUser } from '../_models/applicationUser';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userLocalStorageName: string = "Medico.CurrentUser";

    private currentUserSubject: BehaviorSubject<ApplicationUser>;

    currentUser: Observable<ApplicationUser>;

    constructor(private http: HttpClient,
        private config: ConfigService) {
        const localStorageUser = JSON.parse(localStorage.getItem(this.userLocalStorageName));

        const user = localStorageUser ? localStorageUser : new User();
        const applicationUser = new ApplicationUser(user);

        this.currentUserSubject = new BehaviorSubject<ApplicationUser>(applicationUser);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    get currentUserValue(): ApplicationUser {
        return this.currentUserSubject.value;
    }

    login(loginModel: any) {
        return this.http.post<any>(`${this.config.apiUrl}account/login`, loginModel)
            .toPromise()
            .then(user => {
                if (user && user.isAuthenticated) {
                    localStorage.setItem(this.userLocalStorageName, JSON.stringify(user));

                    const applicationUser = new ApplicationUser(user);
                    this.currentUserSubject.next(applicationUser);
                }

                return user ? user : new User();
            });
    }

    logout() {
        localStorage.removeItem(this.userLocalStorageName);
        this.currentUserSubject.next(null);

        return this.http.post(`${this.config.apiUrl}account/logout`, {})
            .toPromise();
    }

    clearPreviouslySavedUser() {
        localStorage.removeItem(this.userLocalStorageName);
    }
}