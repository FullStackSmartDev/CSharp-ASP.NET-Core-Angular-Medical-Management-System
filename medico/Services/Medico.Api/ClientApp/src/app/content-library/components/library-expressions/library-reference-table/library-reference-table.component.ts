import { Component } from '@angular/core';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { LibraryReferenceTableService } from 'src/app/_services/library-reference-table.service';
import { ReferenceTableHeaderColumn, ReferenceTable } from 'src/app/administration/models/referenceTable';
import { GuidHelper } from 'src/app/_helpers/guid.helper';

@Component({
    selector: "library-reference-table",
    templateUrl: "library-reference-table.component.html",
})
export class LibraryReferenceTableComponent extends BaseAdminComponent {
    selectedReferenceTable: ReferenceTable;

    referenceTableDataSource: any = {};

    referenceTableHeader: ReferenceTableHeaderColumn[] = [];
    referenceTableRecords: any[] = [];

    isReferenceTableFormVisible: boolean = false;

    constructor(private dxDataUrlService: DxDataUrlService,
        private alertService: AlertService,
        private libraryReferenceTableService: LibraryReferenceTableService,
        private devextremeAuthService: DevextremeAuthService) {
        super();

        this.init();
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

    onReferenceTableChanged($event) {
        const referenceTable = $event.selectedRowKeys[0];
        if (!referenceTable)
            return;

        const referenceTableId = referenceTable.id
        if (!referenceTableId)
            return;

        this.libraryReferenceTableService.getById(referenceTableId)
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

    private init() {
        this.initReferenceTableDataSource();
    }

    private initReferenceTableDataSource() {
        this.referenceTableDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.libraryReferenceTables),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private saveReferenceTable(): Promise<void> {
        this.selectedReferenceTable.data.body = this.referenceTableRecords;
        return this.libraryReferenceTableService.save(this.selectedReferenceTable);
    }
}