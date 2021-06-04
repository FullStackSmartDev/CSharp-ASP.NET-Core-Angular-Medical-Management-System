import { Component, ViewChild } from '@angular/core';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DxDataGridComponent } from 'devextreme-angular';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { ReferenceTableGridItem } from 'src/app/administration/models/referenceTableGridItem';
import { ReferenceTableService } from 'src/app/_services/reference-table.service';
import { AlertService } from 'src/app/_services/alert.service';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { ReferenceTable, ReferenceTableHeaderColumn } from 'src/app/administration/models/referenceTable';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "reference-table",
    templateUrl: "reference-table.component.html",
})
export class ReferenceTableComponent extends BaseAdminComponent {
    @ViewChild("referenceTableDataGrid", { static: false }) referenceTableDataGrid: DxDataGridComponent;

    isReferenceTableImportFormVisible: boolean = false;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    referenceTableDataSource: any = {};
    selectedReferenceTables: ReferenceTableGridItem[] = [];

    selectedReferenceTable: ReferenceTable;

    referenceTableHeader: ReferenceTableHeaderColumn[] = [];
    referenceTableRecords: any[] = [];

    isReferenceTableFormVisible: boolean = false;

    constructor(private referenceTableService: ReferenceTableService,
        private alertService: AlertService,
        private companyIdService: CompanyIdService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {

        super();
    }

    ngOnDestroy() {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit() {
        this.init();
        this.subscribeToCompanyIdChanges();
    }

    onNewRecordInsertedInRefTable() {
        this.saveReferenceTable();
    }

    onRecordUpdatedInRefTable() {
        this.saveReferenceTable();
    }

    initNewRefTableRecord($event) {
        $event.data = {
            Id: GuidHelper.generateNewGuid()
        };
    }

    onRecordRemovedFromRefTable() {
        this.saveReferenceTable();
    }

    onReferenceTableImportApplied() {
        this.referenceTableDataGrid.instance
            .getDataSource().reload();

        this.isReferenceTableImportFormVisible = false;
    }

    onReferenceTableImportCanceled() {
        this.isReferenceTableImportFormVisible = false;
    }

    openReferenceTableImportManagementPopup() {
        this.isReferenceTableImportFormVisible = true;
    }

    onReferenceTableChanged($event) {
        const referenceTable = $event.selectedRowKeys[0];
        if (!referenceTable)
            return;

        const referenceTableId = referenceTable.id
        if (!referenceTableId)
            return;

        this.referenceTableService.getById(referenceTableId)
            .then(referenceTable => {
                this.selectedReferenceTable = referenceTable;

                this.referenceTableHeader = referenceTable.data.header;
                this.referenceTableRecords = referenceTable.data.body;

                this.isReferenceTableFormVisible = true;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    switchToReferenceTableForm() {
        this.isReferenceTableFormVisible = true;
    }

    switchToReferenceTablesDataGrid() {
        this.referenceTableHeader = [];
        this.referenceTableRecords = [];
        this.selectedReferenceTable = null;

        this.isReferenceTableFormVisible = false;
    }

    syncWithLibraryReferenceTable(referenceTable: ReferenceTable, $event: any) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to sync reference table ?", "Confirm sync");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.referenceTableService.syncWithLibraryReferenceTable(referenceTable.id, referenceTable.version)
                    .then(() => {
                        this.alertService.info("The reference table was successfully synchronized");
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    private init() {
        this.initReferenceTableDataSource();
    }

    private initReferenceTableDataSource() {
        this.referenceTableDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.referenceTables),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.referenceTableDataGrid && this.referenceTableDataGrid.instance)
                        this.referenceTableDataGrid.instance.refresh();
                }
            });
    }

    private saveReferenceTable(): Promise<void> {
        this.selectedReferenceTable.data.body = this.referenceTableRecords;
        return this.referenceTableService.save(this.selectedReferenceTable);
    }
}