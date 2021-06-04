import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { Location } from '../models/location';

@Injectable()
export class LocationService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    save(location: Location): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}location/`, location)
            .toPromise();
    }

    getById(id: string): Promise<Location> {
        return this.http.get<Location>(`${this.config.apiUrl}location/${id}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}location/${id}`)
            .toPromise();
    }
}