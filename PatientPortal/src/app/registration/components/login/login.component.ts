import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { AlertService } from "src/app/_services/alert.service";
import { UserService } from "src/app/administration/services/user.service";
import {AppRouteNames} from "../../../_classes/appRouteNames";

@Component({
    selector: "login",
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
    @Input() email: string;
    @Output() onBackToEmailForm: EventEmitter<void> = new EventEmitter();
    @ViewChild("loginForm", { static: false }) loginForm: DxFormComponent;

    loginModel: any = {};
    loginErrors: string[] = [];
    returnUrl: string;
    companies: any[] = [];

    constructor(private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService) {
    }

    ngOnInit() {
        this.initUserCompanies()
        this.loginModel.email = this.email;
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    }

    backToEmailForm(): void {
        this.onBackToEmailForm.next();
    }

    login(): void {
        const isLoginFormValid = this.loginForm
            .instance.validate().isValid;

        if (!isLoginFormValid)
            return;

        this.loginErrors = [];

        this.authenticationService.login(this.loginModel)
            .then(user => {
                if (user.errors.length) {
                    this.loginErrors = user.errors;
                }
                else {
                    this.router.navigate([this.returnUrl]);
                }
            }).catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initUserCompanies(): void {
        this.userService.getUserCompanies(this.email)
            .then(companies => {
                this.companies = companies;
                if (companies.length === 1)
                    this.loginModel.companyId = companies[0].id;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error))
    }
}
