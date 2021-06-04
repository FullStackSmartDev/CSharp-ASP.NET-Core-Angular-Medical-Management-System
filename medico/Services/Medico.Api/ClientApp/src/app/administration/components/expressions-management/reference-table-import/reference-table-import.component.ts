import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlertService } from 'src/app/_services/alert.service';
import { ReferenceTableGridItem } from 'src/app/administration/models/referenceTableGridItem';
import { LibraryReferenceTableService } from 'src/app/_services/library-reference-table.service';
import { ReferenceTableService } from 'src/app/_services/reference-table.service';
import { ImportedItemsSearchFilter } from 'src/app/administration/models/importedItemsSearchFilter';

@Component({
    selector: "reference-table-import",
    templateUrl: "./reference-table-import.component.html"
})
export class ReferenceTableImportComponent implements OnInit {
    @Input() companyId: string;

    @Output() onReferenceTableImportApplied: EventEmitter<void> =
        new EventEmitter<void>();

    @Output() onReferenceTableImportCanceled: EventEmitter<void> =
        new EventEmitter<void>();

    referenceTables: ReferenceTableGridItem[] = [];
    selectedReferenceTables: ReferenceTableGridItem[] = [];

    constructor(private libraryReferenceTableService: LibraryReferenceTableService,
        private alertService: AlertService,
        private referenceTableService: ReferenceTableService) {
    }

    ngOnInit() {
        this.loadReferenceTablesFromLibrary();
    }

    cancelReferenceTablesImporting() {
        this.onReferenceTableImportCanceled.next();
    }

    importReferenceTables() {
        if (!this.selectedReferenceTables.length) {
            this.alertService.warning("You haven't selected any tables");
            return;
        }

        const selectedReferenceTableIds = this.selectedReferenceTables
            .map(t => t.id);

        this.referenceTableService.importLibraryReferenceTables(this.companyId, selectedReferenceTableIds)
            .then(() => {
                this.onReferenceTableImportApplied.next();
            });
    }

    private loadReferenceTablesFromLibrary() {
        const templateSearchFilter = new ImportedItemsSearchFilter();
        templateSearchFilter.companyId = this.companyId;
        templateSearchFilter.excludeImported = true;

        this.libraryReferenceTableService
            .getByFilter(templateSearchFilter)
            .then(referenceTables => {
                this.referenceTables = referenceTables;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}