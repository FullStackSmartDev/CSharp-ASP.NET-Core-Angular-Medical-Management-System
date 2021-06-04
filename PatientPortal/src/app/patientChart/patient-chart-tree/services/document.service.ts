import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/_services/config.service';
import { HttpClient } from '@angular/common/http';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { Document } from '../../models/document';

@Injectable()
export class DocumentService {
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    save(document: Document) {
        document.createDate = DateHelper.jsLocalDateToSqlServerUtc(document.createDate);
        return this.http.post<void>(`${this.config.apiUrl}document`, document).toPromise();
    }

    getById(documentId: any) {
        return this.http.get<Document>(`${this.config.apiUrl}document/${documentId}`)
            .toPromise()
            .then(document => {
                if (document) {
                    document.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(document.createDate);
                }

                return document;
            });
    }

    getByPatientId(patientId: string): Promise<Document> {
        return this.http.get<Document>(`${this.config.apiUrl}document/patient/${patientId}`)
            .toPromise()
            .then(document => {
                if (document) {
                    document.createDate = DateHelper.sqlServerUtcDateToLocalJsDate(document.createDate);
                }

                return document;
            });
    }

    uploadFile(appointmentId, patientId, formData) {
        return this.http.post(`${this.config.apiUrl}document/upload/${appointmentId}/${patientId}`, formData);
    }

    uploadTiffFile(appointmentId, patientId, formData) {
        return this.http.post(`${this.config.apiUrl}document/upload-tiff/${appointmentId}/${patientId}`, formData);
    }

    getImageData(filename) {
        return this.http.get(`${this.config.apiUrl}document/imagedata/${filename}`);
    }

    delete(documentId: string) {
        return this.http.delete<void>(`${this.config.apiUrl}document/${documentId}`).toPromise();
    }
}