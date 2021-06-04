import { Injectable } from "@angular/core";
import { alert } from 'devextreme/ui/dialog';
import { confirm } from 'devextreme/ui/dialog';
import { AlertMessageTypes } from '../_classes/alertMessageTypes';

@Injectable({ providedIn: 'root' })
export class AlertService {
    alert(message: string, title: string): void {
        alert(message, title);
    }

    confirm(message: string, title: string): Promise<boolean> {
        return confirm(message, title);
    }

    info(errorMessage: string): void {
        this.alert(errorMessage, AlertMessageTypes.info);
    }

    error(errorMessage: string): void {
        this.alert(errorMessage, AlertMessageTypes.error);
    }

    warning(warningMessage: string): void {
        this.alert(warningMessage, AlertMessageTypes.warning);
    }
}