import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from "../../../constants/apiUrls";
import { IcdCodeKeywordsView } from "../../../dataModels/icdCodeKeywordsView";
import { DevExtremeGridResult } from "../devExtremeGridResult";

@Injectable()
export class IcdCodeKeywordsDataService {
    constructor(private httpClient: HttpClient) {
    }

    getById(id: string): Promise<IcdCodeKeywordsView> {
        return this.httpClient.get<IcdCodeKeywordsView>(`${ApiUrl.url}icdcodekeyword/${id}`)
            .toPromise();
    }

    search(skipCount: number, takeCount: number): Promise<DevExtremeGridResult<IcdCodeKeywordsView>> {
        return this.httpClient.get<DevExtremeGridResult<IcdCodeKeywordsView>>(`${ApiUrl.url}icdcodekeyword/${skipCount}/${takeCount}`)
            .toPromise()
            .then(result => {
                return new DevExtremeGridResult<IcdCodeKeywordsView>(result.Data, result.TotalCount);
            });
    }

    create(keywordValue: string, icdCodeId: string): Promise<any> {
        const icdCodeKeyword = { keywordValue: keywordValue, icdCodeId: icdCodeId };
        return this.httpClient.post<IcdCodeKeywordsView>(`${ApiUrl.url}icdcodekeyword/`, icdCodeKeyword)
            .toPromise();
    }

    delete(keywordId: string, icdCodeId: string): Promise<any> {
        return this.httpClient.delete<IcdCodeKeywordsView>(`${ApiUrl.url}icdcodekeyword/${keywordId}/${icdCodeId}`)
            .toPromise();
    }
}