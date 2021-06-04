import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            const roles = route.data.roles;
            const userRoles = currentUser.roles;

            if (!roles || !roles.length)
                return true;

            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (userRoles.indexOf(role) !== -1)
                    return true;
            }

            if (currentUser.isAuthenticated) {
                this.router.navigate(['/']);
                return false;
            }

            this.router.navigate(['/login']);
            return false;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}