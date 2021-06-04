import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from "../../../constants/apiUrls";
import { Medication } from "../../../dataModels/medication";

@Injectable()
export class MedicationReadDataService {
    constructor(private httpClient: HttpClient) {
    }

    getById(id: string): Promise<Medication> {
        return this.httpClient.get<Medication>(`${ApiUrl.url}ndc/${id}`)
            .toPromise();
    }

    search(takeItemCount: number, searchString: string): Promise<Medication[]> {
        return searchString
            ? this.httpClient.get<Medication[]>(`${ApiUrl.url}ndc/search/${takeItemCount}/${searchString}`)
                .toPromise()
            : this.httpClient.get<Medication[]>(`${ApiUrl.url}ndc/search/${takeItemCount}`)
                .toPromise()
    }
}