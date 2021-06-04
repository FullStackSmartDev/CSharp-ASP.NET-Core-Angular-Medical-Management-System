import { Component } from '@angular/core';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { LibraryPatientChartHttpService } from 'src/app/_services/library-patient-chart-http.service';

@Component({
    selector: "library-patient-chart-document",
    templateUrl: "library-patient-chart-document.component.html",
})
export class LibraryPatientChartDocumentComponent extends BaseAdminComponent {
    constructor(public libraryPatientChartHttpService: LibraryPatientChartHttpService) {
        super();
    }
}