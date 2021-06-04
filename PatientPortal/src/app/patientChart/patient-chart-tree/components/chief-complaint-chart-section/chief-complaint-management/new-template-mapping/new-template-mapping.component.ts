import { Component } from "@angular/core";
import { ChiefComplaint } from 'src/app/_models/chiefComplaint';
import { AlertService } from 'src/app/_services/alert.service';
import { CompanyIdService } from 'src/app/_services/company-id.service';

@Component({
    selector: "new-template-mapping",
    templateUrl: "./new-template-mapping.component.html"
})
export class NewTemplateMappingComponent {
    companyId: string;

    mapping: any = {
        chiefComplaint: new ChiefComplaint()
    }

    isNewMapping: boolean = true;
    isMappingFormVisible: boolean = true;

    constructor(private alertService: AlertService,
        private companyIdService: CompanyIdService) {

        this.companyId = this.companyIdService.companyIdValue;
    }

    onTemplateKeywordMappingSaved() {
        this.resetMappingForm();
        this.isMappingFormVisible = false;
        this.alertService.info("Mapping is created successfully")

        setTimeout(() => {
            this.isMappingFormVisible = true;
        }, 0);
    }

    private resetMappingForm() {
        this.mapping = {
            chiefComplaint: new ChiefComplaint()
        };

        this.isNewMapping = true;
    }
}