import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { DxPopupComponent, DxListComponent } from 'devextreme-angular';
import { LoadPanelService } from '../../provider/loadPanelService';
import { ChiefComplaintKeywordDataService, ChiefComplaintRelatedKeywordDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ChiefComplaintKeyword } from '../../dataModels/chiefComplaintKeyword';
import { ChiefComplaintRelatedKeyword } from '../../dataModels/chiefComplaintRelatedKeyword';
import { InternetConnectionTrackService } from '../../provider/internetConnectionTrackService';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'internetConnectionTrackComponent.html',
    selector: 'internet-connection-track'
})

export class InternetConnectionTrackComponent implements OnInit, OnDestroy {
    internetConnectionTrackSubscription: Subscription;
    isConnected: boolean = false;

    constructor(private internetConnectionTrackService: InternetConnectionTrackService) {

    }

    ngOnDestroy(): void {
        this.internetConnectionTrackSubscription
            .unsubscribe();
    }

    ngOnInit(): void {
        this.internetConnectionTrackSubscription = this.internetConnectionTrackService
            .isConnected.subscribe(isConnected => {
                this.isConnected = isConnected;
            });
    }
}
