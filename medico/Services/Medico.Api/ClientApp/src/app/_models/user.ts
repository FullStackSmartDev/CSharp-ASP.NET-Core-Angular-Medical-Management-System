import { Role } from './role';

export class User {
    isAuthenticated: boolean;
    roles: Role[];
    errors: string[];
    companyId: string;

    constructor(isAuthenticated: boolean = false) {
        this.isAuthenticated = false;
        this.roles = [];
        this.errors = [];
        this.companyId = "";
    }

    isUserInRole(role: Role): boolean {
        if (!this.roles.length)
            return false;

        return this.roles.indexOf(role) !== -1;
    }

    isUserHaveAtLeastOneRole(routeRoles: Role[]): boolean {
        if (!this.roles.length)
            return false;

        if (!routeRoles || !routeRoles.length)
            return this.isAuthenticated;

        for (let i = 0; i < this.roles.length; i++) {
            const userRole = this.roles[i];
            if (routeRoles.indexOf(userRole) !== -1)
                return true;
        }

        return false;
    }
}