import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CryptoService } from './cryptoService';
import { DataService } from './dataService';
import { TableNames } from '../constants/tableNames';

@Injectable()
export class AuthorizationService {

    _currentUser: any = null;

    constructor(private cryptoService: CryptoService, private dataService: DataService) { }

    public authorize(email: string, password: string): Promise<any> {
        const self = this;
        return this.dataService.getAll(TableNames.appUser, false)
            .then(appUsers => {
                const existedAppUsers = appUsers.filter(user => {
                    const decryptedUserPassword = self.cryptoService.decrypt(user.Hash);
                    return email === user.Login && decryptedUserPassword === password;
                });
                if (!existedAppUsers || !existedAppUsers.length || existedAppUsers.length !== 1) {
                    return false;
                }
                self._currentUser = existedAppUsers[0];
                return true;
            })
            .catch(error => {
                console.log(error);
            });
    }

    get currentUser(): any {
        return this._currentUser;
    }

    get currentUserPermissionGroups(): Promise<Array<any>> {
        if (!this.currentUser)
            return Promise.resolve([]);
        const userId = this.currentUser.Id;
        return this.dataService.getUserPermissionGroups(userId);
    }

    get isSuperAdmin(): boolean {
        return this._currentUser.isSuperAdmin;
    }
}