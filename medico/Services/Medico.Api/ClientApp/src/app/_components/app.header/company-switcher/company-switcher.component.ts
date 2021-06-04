import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { CompanyIdService } from "src/app/_services/company-id.service";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { Subscription } from "rxjs";
import { Role } from "src/app/_models/role";
import { CompanyService } from "src/app/_services/company.service";
import { AlertService } from "src/app/_services/alert.service";
import { CompanyCreateUpdateTrackService } from "src/app/_services/company-create-update-track.service";
import { DxSelectBoxComponent } from "devextreme-angular";
import { GuidHelper } from "src/app/_helpers/guid.helper";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { AppRouteNames } from 'src/app/_classes/appRouteNames';
import { Company } from 'src/app/_models/company';
import { ApiBaseUrls } from 'src/app/_models/apiBaseUrls';

@Component({
    selector: "company-switcher",
    templateUrl: "company-switcher.component.html",
})
export class CompanySwitcherComponent implements OnInit, OnDestroy {
    @ViewChild("companiesSelectBox", { static: false }) companiesSelectBox: DxSelectBoxComponent;

    companyName: string;
    companyId: string;

    isCompanySelectBoxVisible: boolean = false;

    currentUserSubscription: Subscription;

    companyDataSource: any = {};

    constructor(private companyIdService: CompanyIdService,
        private dxDataUrlService: DxDataUrlService,
        private authenticationService: AuthenticationService,
        private companyService: CompanyService,
        private alertService: AlertService,
        private companyCreateUpdateTrackService: CompanyCreateUpdateTrackService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    ngOnDestroy(): void {
        this.currentUserSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.initCompanyDataSource();
        this.subscribeToApplicationUserChanges();
        this.subscribeToCompanyChanges();
    }

    onCompanyListChanged($event): void {
        let companyId = $event.value;

        if (companyId === null) {
            const previousSelectedCompany = $event.previousValue;
            this.companiesSelectBox.value = previousSelectedCompany;
            companyId = previousSelectedCompany;
        }

        this.companyIdService.setCompanyId(companyId);
    }

    private subscribeToCompanyChanges() {
        this.companyCreateUpdateTrackService.companyChanges
            .subscribe((companyId) => {
                if (companyId != GuidHelper.emptyGuid && this.companiesSelectBox && this.companiesSelectBox.instance) {
                    this.refreshCompanySelectBox();
                    setTimeout(() => {
                        this.companyId = companyId;
                    }, 1000);
                }
            });
    }

    private refreshCompanySelectBox() {
        this.companiesSelectBox.instance.reset();
        this.companiesSelectBox.instance.getDataSource().reload();
    }

    private subscribeToApplicationUserChanges() {
        this.authenticationService.currentUser
            .subscribe(currentUser => {
                if (!currentUser) {
                    this.isCompanySelectBoxVisible = false;
                    this.companyName = "";
                    return;
                }

                const isUserSuperAdmin = currentUser.isUserInRole(Role.SuperAdmin);
                this.isCompanySelectBoxVisible = isUserSuperAdmin;

                if (isUserSuperAdmin)
                    this.setCurrentCompanyId();
                else {
                    this.setCurrentCompanyName(currentUser.companyId);
                    this.companyIdService.setCompanyId(currentUser.companyId);
                }
            });
    }

    private setCurrentCompanyName(companyId: string) {
        this.companyService.getById(companyId)
            .then(company => {
                this.companyName = company.name;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initCompanyDataSource() {
        this.companyDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl(ApiBaseUrls.company),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, ajaxOptions) => { }, this)
        });
    }

    private setCurrentCompanyId() {
        const currentUrl = location.pathname;
        const isPatientChartUrl = currentUrl
            .indexOf(AppRouteNames.patientChart) !== -1;

        let companyPromise: Promise<Company>;

        if (isPatientChartUrl) {
            //When super admin user navigate to application using direct link to patient chart tree,
            //we have to set the company which appointment belongs to.
            const appointmentId = currentUrl
                .split("/")[2];

            companyPromise = this.companyService
                .getByAppointmentId(appointmentId);
        }
        else
            companyPromise = this.companyService
                .getFirst();

        companyPromise
            .then(company => {
                this.companyId = company.id;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}