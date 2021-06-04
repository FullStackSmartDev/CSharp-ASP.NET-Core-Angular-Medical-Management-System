import { Component, ViewChild } from "@angular/core";
import { SearchConfiguration } from 'src/app/_classes/searchConfiguration';
import { DxDataGridComponent, DxPopupComponent, DxFileUploaderComponent } from 'devextreme-angular';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { MedicationUpdateService } from '../../services/medication-update.service';
import { MedicationUpdateStatus } from '../../models/medicationUpdateStatus';
import { saveAs } from 'file-saver';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "medication-management",
    templateUrl: "./medication-management.component.html"
})
export class MedicationManagementComponent {
    searchConfiguration: SearchConfiguration = new SearchConfiguration();

    @ViewChild("medicationUpdateDataGrid", { static: false }) medicationUpdateDataGrid: DxDataGridComponent;
    @ViewChild("medicationUpdatePopup", { static: false }) medicationUpdatePopup: DxPopupComponent;
    @ViewChild("medicationsExcelFileUploader", { static: false }) medicationsExcelFileUploader: DxFileUploaderComponent;

    medicationUpdate: any = {};

    selectedCategories: Array<any> = [];
    isNewMedicationUpdate: boolean = true;

    medicationUpdateDataSource: any = {};

    isMedicationUpdatePopupOpened: boolean = false;

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private medicationUpdateService: MedicationUpdateService,
        private devextremeAuthService: DevextremeAuthService) {

        this.init();
    }

    downloadExcelMedicationsFile($event: Event, fileName: string) {
        $event.preventDefault();
        this.medicationUpdateService.downloadMedicationsExcelFile(fileName)
            .then(blob => {
                saveAs(blob, fileName);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

    }

    refreshMedicationUpdateDataGrid() {
        this.medicationUpdateDataGrid.instance.refresh();
    }

    openMedicationUpdateForm() {
        this.isMedicationUpdatePopupOpened = true;
    }

    createUpdateMedicationUpdate() {
        const medicationsFile = this.medicationsExcelFileUploader.value[0];
        if (!medicationsFile) {
            this.alertService.warning("You have to upload excel file with medications");
            return;
        }
        
        this.medicationUpdateService.scheduleMedicationsUpdate(medicationsFile)
            .then(() => {
                this.refreshMedicationUpdateDataGrid();
                this.isMedicationUpdatePopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private init(): any {
        this.initMedicationUpdateDataSource();
    }

    private initMedicationUpdateDataSource(): any {
        const medicationUpdateItemStore = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("medications-scheduled-item"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });

        this.medicationUpdateDataSource.store = medicationUpdateItemStore;
        this.applyDecoratorForDataSourceLoadFunc(medicationUpdateItemStore);
    }

    private applyDecoratorForDataSourceLoadFunc(store: any) {
        const nativeLoadFunc = store.load;
        store.load = loadOptions => {
            return nativeLoadFunc.call(store, loadOptions)
                .then(result => {
                    result.forEach(item => {
                        item.status = MedicationUpdateStatus[item.status];
                    });
                    return result;
                });
        };
    }
}