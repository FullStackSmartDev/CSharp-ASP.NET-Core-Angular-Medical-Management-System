import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlertService } from 'src/app/_services/alert.service';
import { ExpressionGridItemModel } from 'src/app/_models/expressionGridItemModel';
import { LibraryExpressionService } from 'src/app/_services/library-expression.service';
import { ImportedItemsSearchFilter } from 'src/app/administration/models/importedItemsSearchFilter';
import { ExpressionService } from 'src/app/_services/expression.service';

@Component({
    selector: "expression-import",
    templateUrl: "./expression-import.component.html"
})
export class ExpressionImportComponent implements OnInit {
    @Input() companyId: string;

    @Output() onExpressionImportApplied: EventEmitter<void> =
        new EventEmitter<void>();

    @Output() onExpressionImportCanceled: EventEmitter<void> =
        new EventEmitter<void>();

    expressions: ExpressionGridItemModel[] = [];
    selectedExpressions: ExpressionGridItemModel[] = [];

    constructor(private libraryExpressionService: LibraryExpressionService,
        private alertService: AlertService,
        private expressionService: ExpressionService) {
    }

    ngOnInit() {
        this.loadExpressionsFromLibrary();
    }

    cancelExpressionsImporting() {
        this.onExpressionImportCanceled.next();
    }

    importExpressions() {
        if (!this.selectedExpressions.length) {
            this.alertService.warning("You haven't selected any expressions");
            return;
        }

        const selectedExpressionIds = this.selectedExpressions
            .map(t => t.id);

        this.expressionService.importLibraryExpressions(this.companyId, selectedExpressionIds)
            .then(() => {
                this.onExpressionImportApplied.next();
            });
    }

    private loadExpressionsFromLibrary() {
        const templateSearchFilter = new ImportedItemsSearchFilter();
        templateSearchFilter.companyId = this.companyId;
        templateSearchFilter.excludeImported = true;

        this.libraryExpressionService
            .getByFilter(templateSearchFilter)
            .then(expressions => {
                this.expressions = expressions;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}