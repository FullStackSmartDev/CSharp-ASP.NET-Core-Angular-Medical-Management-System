import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from "../../../constants/apiUrls";
import { Keyword } from "../../../dataModels/keyword";

@Injectable()
export class KeywordDataService {
    constructor(private httpClient: HttpClient) {
    }

    getByIcdCode(icdCodeId: string): Promise<Keyword[]> {
        return this.httpClient.get<Keyword[]>(`${ApiUrl.url}keyword/icd/${icdCodeId}`)
            .toPromise();
    }

    save(keywordValue: string): Promise<any> {
        return this.httpClient.post(`${ApiUrl.url}keyword`, { keywordValue: keywordValue })
            .toPromise();
    }
}