import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class LoadPanelService {
    loaderStatusInfo: BehaviorSubject<LoadPanelInfo> =
        new BehaviorSubject<LoadPanelInfo>(new LoadPanelInfo());

    showLoader(content?: string) {
        const loaderStatusInfo = new LoadPanelInfo(true, content ? content : "Loading...")
        this.loaderStatusInfo.next(loaderStatusInfo);
    }

    hideLoader() {
        this.loaderStatusInfo
            .next(new LoadPanelInfo());
    }
}

export class LoadPanelInfo {
    show: boolean;
    loadMessage: string;

    constructor(show: boolean = false, loadMessage: string = "") {
        this.show = show;
        this.loadMessage = loadMessage;
    }
}