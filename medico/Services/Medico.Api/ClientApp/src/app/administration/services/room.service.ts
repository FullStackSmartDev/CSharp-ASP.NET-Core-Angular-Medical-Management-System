import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { Room } from '../models/room';

@Injectable()
export class RoomService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByLocationId(locationId: string): Promise<Room[]> {
        return this.http.get<Room[]>(`${this.config.apiUrl}room/location/${locationId}`)
            .toPromise();
    }

    save(room: Room): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}room/`, room)
            .toPromise();
    }

    getById(id: string): Promise<Room> {
        return this.http.get<Room>(`${this.config.apiUrl}room/${id}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}room/${id}`)
            .toPromise();
    }
}