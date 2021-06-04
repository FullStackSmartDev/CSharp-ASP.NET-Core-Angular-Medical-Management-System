import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
    get apiUrl(): string {
        return environment.apiUrl;
    }

    get baseUrl(): string {
        return environment.baseUrl;
    }
}