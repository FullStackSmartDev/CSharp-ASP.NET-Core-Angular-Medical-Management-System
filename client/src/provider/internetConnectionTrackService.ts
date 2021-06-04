import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class InternetConnectionTrackService {
    isConnected: Observable<boolean>;

    constructor(){
        this.isConnected = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(mapTo(true)),
            fromEvent(window, 'offline').pipe(mapTo(false))
          );
    }
}