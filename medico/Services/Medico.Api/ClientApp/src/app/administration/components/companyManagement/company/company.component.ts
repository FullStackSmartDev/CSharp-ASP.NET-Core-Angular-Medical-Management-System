import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Company } from 'src/app/_models/company';
import { CompanyService } from 'src/app/_services/company.service';
import { DxFormComponent } from 'devextreme-angular';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { CompanyCreateUpdateTrackService } from 'src/app/_services/company-create-update-track.service';
import { ZipCodeType } from 'src/app/patients/models/zipCodeType';
@Component({
    selector: 'company',
    templateUrl: './company.component.html'
})
export class CompanyComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("companyForm", { static: false }) companyForm: DxFormComponent

    companyIdSubscription: Subscription;
    companyId: string = GuidHelper.emptyGuid;
    company: Company = new Company();

    constructor(private companyService: CompanyService,
        private alertService: AlertService,
        private companyIdService: CompanyIdService,
        private companyCreateUpdateTrackService: CompanyCreateUpdateTrackService) {
        super();
    }

    updateCompany(): void {
        const isCompanyFormValid = this.companyForm
            .instance.validate()
            .isValid;

        if (!isCompanyFormValid)
            return;

        this.companyService.save(this.company)
            .then(() => {
                this.companyCreateUpdateTrackService.emitCompanyChanges(this.companyId);
                this.alertService.info("Company was successfully updated");
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    get zipMask(): string {
        switch (this.company.zipCodeType) {
            case ZipCodeType.FiveDigit:
                return this.validationMasks.fiveDigitZip;
            case ZipCodeType.NineDigit:
                return this.validationMasks.nineDigitZip;
        }
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId && companyId !== this.companyId) {
                    this.companyId = companyId;
                    this.companyService.getById(this.companyId)
                        .then(company => {
                            this.company = company;
                        })
                        .catch(error => this.alertService.error(error.message ? error.message : error));
                }
            });
    }
}