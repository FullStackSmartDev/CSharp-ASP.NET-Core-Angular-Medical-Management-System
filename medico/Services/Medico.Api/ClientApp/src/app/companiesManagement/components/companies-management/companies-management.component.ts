import { Component, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { Company } from 'src/app/_models/company';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { CompanyService } from 'src/app/_services/company.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { CompanyCreateUpdateTrackService } from 'src/app/_services/company-create-update-track.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { ZipCodeType } from 'src/app/patients/models/zipCodeType';
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';

@Component({
    selector: "companies-management",
    templateUrl: "companies-management.component.html"
})
export class CompaniesManagementComponent extends BaseAdminComponent {
    @ViewChild("companyDataGrid", { static: false }) companyDataGrid: DxDataGridComponent;
    @ViewChild("companyPopup", { static: false }) companyPopup: DxPopupComponent;
    @ViewChild("companyForm", { static: false }) companyForm: DxFormComponent;

    companyDataSource: any = {};

    selectedCompanys: Array<any> = [];

    company: Company = new Company();
    isNewCompany: boolean = true;
    isCompanyPopupOpened: boolean = false;

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private companyService: CompanyService,
        private companyCreateUpdateTrackService: CompanyCreateUpdateTrackService,
        private devextremeAuthService: DevextremeAuthService) {
        super();
        this.init();
    }

    get zipMask(): string {
        switch (this.company.zipCodeType) {
            case ZipCodeType.FiveDigit:
                return this.validationMasks.fiveDigitZip;
            case ZipCodeType.NineDigit:
                return this.validationMasks.nineDigitZip;
        }
    }

    isFiveDigitCode(zipCodeType: number): boolean {
        return zipCodeType === ZipCodeType.FiveDigit;
    }

    isNineDigitCode(zipCodeType: number): boolean {
        return zipCodeType === ZipCodeType.NineDigit;
    }

    openCompanyForm() {
        this.isCompanyPopupOpened = true;
    }

    onCompanyPopupHidden() {
        this.resetCreateUpdateCompanyForm();
    }

    createUpdateCompany() {
        const validationResult = this.companyForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.companyService.save(this.company)
            .then((company) => {
                this.companyDataGrid.instance.refresh();
                this.resetCreateUpdateCompanyForm();
                this.isCompanyPopupOpened = false;
                this.companyCreateUpdateTrackService.emitCompanyChanges(company.id);
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    ngAfterViewInit(): void {
        this.registerEscapeBtnEventHandler(this.companyPopup);
    }

    deactivateCompany(company: any, $event: any) {
        $event.stopPropagation();
        const companyId = company.id;

        this.companyService.getById(companyId)
            .then(company => {
                const confirmationPopup = this.alertService
                    .confirm(`Are you sure you want to deactivate the "${company.name}" company ?`, "Confirm deactivation");

                confirmationPopup.then(dialogResult => {
                    if (dialogResult) {
                        company.isActive = false;
                        this.companyService.save(company)
                            .then(() => {
                                this.companyDataGrid.instance.refresh();
                            })
                            .catch(error => this.alertService.error(error.message ? error.message : error));

                    }
                });
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    activateCompany(company: any, $event: any) {
        $event.stopPropagation();
        const companyId = company.id;

        this.companyService.getById(companyId)
            .then(company => {
                const confirmationPopup = this.alertService
                    .confirm(`Are you sure you want to activate the "${company.name}" company ?`, "Confirm activation");

                confirmationPopup.then(dialogResult => {
                    if (dialogResult) {
                        company.isActive = true;
                        this.companyService.save(company)
                            .then(() => {
                                this.companyDataGrid.instance.refresh();
                            })
                            .catch(error => this.alertService.error(error.message ? error.message : error));

                    }
                });
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    onCompanySelected($event) {
        const selectedCompany = $event.selectedRowsData[0];
        if (!selectedCompany) {
            return;
        }

        const selectedCompanyId = $event.selectedRowsData[0].id;
        this.companyService.getById(selectedCompanyId)
            .then((company) => {
                this.company = company;
                this.isNewCompany = false;
                this.isCompanyPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    getState(data) {
        const stateNumber = data.state;
        return this.states.filter(s => s.value === stateNumber)[0].name;
    }

    private resetCreateUpdateCompanyForm() {
        this.company = new Company();
        this.isNewCompany = true;
        this.selectedCompanys = [];
    }

    private init(): any {
        this.initCompanyDataSource();
    }

    private initCompanyDataSource(): void {
        this.companyDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl(ApiBaseUrls.company),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, ajaxOptions) => { }, this)
        });
    }
}