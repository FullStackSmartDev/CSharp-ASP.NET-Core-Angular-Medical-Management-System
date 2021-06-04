import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { Phrase } from '../models/phrase';
import { ISearchableByName } from 'src/app/_interfaces/iSearchableByName';

@Injectable()
export class PhraseService implements ISearchableByName {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    save(phrase: Phrase): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}phrase/`, phrase)
            .toPromise();
    }

    getById(id: string): Promise<Phrase> {
        return this.http.get<Phrase>(`${this.config.apiUrl}phrase/${id}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}phrase/${id}`)
            .toPromise();
    }

    getByName(name: string, companyId: string): Promise<Phrase> {
        return this.http.get<Phrase>(`${this.config.apiUrl}phrase/name/${name}/company/${companyId}`)
            .toPromise();
    }
}