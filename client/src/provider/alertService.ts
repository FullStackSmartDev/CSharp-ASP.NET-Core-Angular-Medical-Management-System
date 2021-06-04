import { Injectable } from "@angular/core";
import { alert } from 'devextreme/ui/dialog';
import { confirm } from 'devextreme/ui/dialog';
import { AlertMessageTypes } from "../constants/alertMessageTypes";

@Injectable()
export class AlertService {
    alert(message: string, title: string): void {
        alert(message, title);
    }

    confirm(message: string, title: string): Promise<boolean> {
        return confirm(message, title);
    }

    error(errorMessage: string): void {
        this.alert(errorMessage, AlertMessageTypes.error);
    }

    warning(warningMessage: string): void {
        this.alert(warningMessage, AlertMessageTypes.warning);
    }
}