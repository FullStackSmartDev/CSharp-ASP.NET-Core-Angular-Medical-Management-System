import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { StringHelper } from '../helpers/stringHelper';
import { ApiUrl } from '../constants/apiUrls';

@Injectable()
export class SyncService {
    _pullUrl: string = `${ApiUrl.url}pull/{0}`;
    _pushUrl: string = `${ApiUrl.url}push/{0}`;
    _deleteUrl: string = `${ApiUrl.url}delete/{0}`;

    constructor(private http: Http) { }

    pull(table: string): Promise<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let opts = new RequestOptions();
        opts.headers = headers;

        const url = StringHelper
            .format(this._pullUrl, table.toLowerCase());

        return this.http.get(url, opts)
            .map(response => {
                let insertedItems = JSON.parse(response["_body"]);
                return { tableName: table, insertedItems: insertedItems };
            })
            .toPromise()
            .catch(err => { console.log(err) });
    }

    pushSingleItem(table: string, item: any) {
        const url = StringHelper.format(this._pushUrl, table.toLowerCase());
        const requestOptions = this.getRequestOptions();

        const pushedItems = [item];
        return this.http.post(url, pushedItems, requestOptions)
            .toPromise();
    }

    push(table: string, items: Array<any>): Promise<any> {
        const url = StringHelper.format(this._pushUrl, table.toLowerCase());
        const requestOptions = this.getRequestOptions();

        return this.http.post(url, items, requestOptions)
            .toPromise();
    }

    delete(table: string, item: any): Promise<any> {
        const url = StringHelper.format(this._deleteUrl, table.toLowerCase());
        const requestOptions = this.getRequestOptions();

        return this.http.post(url, item, requestOptions)
            .toPromise();
    }

    private getRequestOptions(): RequestOptions {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let requestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return requestOptions;
    }
}