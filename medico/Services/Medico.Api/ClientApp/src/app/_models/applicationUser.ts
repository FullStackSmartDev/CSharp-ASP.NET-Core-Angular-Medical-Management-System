import { Role } from './role';
import { User } from './user';

export class ApplicationUser {
    constructor(private user: User) {
    }

    get roles(): string[] {
        return this.user.roles;
    }

    get companyId(): string {
        return this.user.companyId;
    }

    get isAuthenticated(): boolean {
        return this.user.isAuthenticated;
    }

    isUserInRole(role: Role): boolean {
        const userRoles = this.user.roles;

        if (!userRoles.length)
            return false;

        return userRoles.indexOf(role) !== -1;
    }

    isUserHaveAtLeastOneRole(routeRoles: Role[]): boolean {
        const userRoles = this.user.roles;

        if (!userRoles.length)
            return false;

        if (!routeRoles || !routeRoles.length)
            return this.isAuthenticated;

        for (let i = 0; i < userRoles.length; i++) {
            const userRole = userRoles[i];
            if (routeRoles.indexOf(userRole) !== -1)
                return true;
        }

        return false;
    }
}