import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DxAlertService {
    alertInfo: BehaviorSubject<AlertInfo> =
        new BehaviorSubject<AlertInfo>(new AlertInfo());

    show(alertInfo: AlertInfo) {
        this.alertInfo.next(alertInfo);
    }
}

export class AlertInfo {
    message: string;
    visible: boolean;
    height: number;
    width: number;
    title: string;

    constructor(visible: boolean = false,
        message: string = "", height: number = 0,
        width: number = 0, title: string = "") {

        this.visible = visible;
        this.message = message;
        this.width = width;
        this.height = height;
        this.title = title;
    }
}