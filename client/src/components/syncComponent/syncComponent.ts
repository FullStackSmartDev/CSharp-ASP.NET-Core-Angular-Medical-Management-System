import { Component } from '@angular/core';
import { ToastService } from '../../provider/toastService';
import { DataSynchronizationService } from '../../provider/dataSynchronizationService';

@Component({
    templateUrl: 'syncComponent.html',
    selector: 'sync-component'
})

export class SyncComponent {
    syncBtnText: string = "Synchronize";
    syncBtnType: string = "Default";

    isLoaderVisible: boolean = false;
    loaderMessage: string = "Data synchronization...";

    constructor(private toastService: ToastService,
        private dataSynchronizationService: DataSynchronizationService) {
    }

    synchronizeData() {
        const self = this;
        this.isLoaderVisible = true;

        this.dataSynchronizationService.synchronizeTables()
            .then(() => {
                self.isLoaderVisible = false;
                self.toastService.showSuccessMessage("Data successfully synchronized");
            })
            .catch(error => self.toastService
                .showErrorMessage(error.message ? error.message : error));
    }
}