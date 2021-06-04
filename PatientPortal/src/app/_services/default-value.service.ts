import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { DefaultValue } from '../_models/defaultValue';

@Injectable({ providedIn: 'root' })
export class DefaultValueService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByKeyName(keyName: string) {
        return this.http.get<DefaultValue>(`${this.config.apiUrl}defaultvalue/key/${keyName}`)
            .toPromise();
    }
}