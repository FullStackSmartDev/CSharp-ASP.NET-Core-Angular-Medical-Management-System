import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

@Injectable()
export class ToastService {
    showSuccessMessage(message: string, duration: number = 2000) {
        notify(message, "success", duration)
    }

    showErrorMessage(errorMessage: string, duration: number = 2000) {
        notify(errorMessage, "error", duration)
    }
}