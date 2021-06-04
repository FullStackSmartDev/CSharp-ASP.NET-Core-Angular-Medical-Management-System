import {Component, Input, OnInit} from "@angular/core";
import { AlertService } from 'src/app/_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {AppRouteNames} from "../../../_classes/appRouteNames";
import {AccountService} from "../../../_services/account.service";


@Component({
  selector: "forgot-password",
  templateUrl: "./forgot-password.component.html"
})

export class ForgotPasswordComponent implements OnInit{
  @Input() email: string;

  emailModel: any = {
    email: ""
  }

  constructor(private alertService: AlertService,
              private accountService: AccountService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    const { userId, code } = this.activatedRoute.snapshot.queryParams;
    if(userId && code) {
      this.router.navigate([AppRouteNames.resetPassword], {queryParams: {userId: userId, code: code}});
    }
  }

  btnForgotPassword() {
    const email = this.emailModel.email;
    this.accountService.forgotPassword(email)
      .then(validationResult => {
        if (validationResult.isValid) {
          this.email = email;
          this.alertService.info(`Instructions Sent You'll receive an email at ${email} Check your spam folder too!;`);
          this.router.navigate([AppRouteNames.login]);
        } else {
          this.alertService.error(`Unable to find user with such email: ${email}`);
        }
      }).catch(error => this.alertService.error(error.message ? error.message : error));
  }

  backToEmailForm(): void {
    this.router.navigate([AppRouteNames.login])
  }
}
