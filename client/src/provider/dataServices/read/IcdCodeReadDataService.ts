import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { IcdCode } from "../../../dataModels/icdCode";
import { ApiUrl } from "../../../constants/apiUrls";

@Injectable()
export class IcdCodeReadDataService {
    constructor(private httpClient: HttpClient) {
    }

    getById(id: string): Promise<IcdCode> {
        return this.httpClient.get<IcdCode>(`${ApiUrl.url}icd/${id}`)
            .toPromise();
    }

    getByKeyword(keyword: string): Promise<IcdCode[]> {
        return this.httpClient.get<IcdCode[]>(`${ApiUrl.url}icd/keyword/${keyword}`)
            .toPromise();
    }

    search(takeItemCount: number, searchString: string): Promise<IcdCode[]> {
        return searchString
            ? this.httpClient.get<IcdCode[]>(`${ApiUrl.url}icd/search/${takeItemCount}/${searchString}`)
                .toPromise()
            : this.httpClient.get<IcdCode[]>(`${ApiUrl.url}icd/search/${takeItemCount}`)
                .toPromise()
    }
}