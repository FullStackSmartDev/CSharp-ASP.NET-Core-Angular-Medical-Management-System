import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "src/app/_services/config.service";

@Injectable()
export class MedicationUpdateService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    downloadMedicationsExcelFile(fileName: string) {
        return this.http.get(`${this.config.apiUrl}medications-scheduled-item/download/medications/${fileName}`, { responseType: 'blob' })
            .toPromise();
    }

    scheduleMedicationsUpdate(medicationsExcelFile: File): Promise<void> {
        const formData = new FormData();
        formData.append("file", medicationsExcelFile);

        return this.http.post<void>(`${this.config.apiUrl}medications-scheduled-item/`, formData)
            .toPromise();
    }
}