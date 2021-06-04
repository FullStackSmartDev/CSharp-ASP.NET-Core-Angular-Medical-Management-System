import { Component, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { AlertService } from 'src/app/_services/alert.service';
import { UserService } from 'src/app/administration/services/user.service';

@Component({
  selector: 'root-login',
  templateUrl: './root-login.component.html'
})
export class RootLoginComponent {
  @ViewChild("loginForm", { static: false }) loginForm: DxFormComponent;
  @ViewChild("emailForm", { static: false }) emailForm: DxFormComponent;

  emailModel: any = {
    email: ""
  }

  email: string = "";

  companyDataSource: any = {};

  constructor(private alertService: AlertService,
    private userService: UserService) {
  }

  resetEmail(): void {
    this.emailModel.email = "";
    this.email = ""; 
  }

  findUsers(): void {
    const isEmailFormValid = this.emailForm
      .instance.validate()
      .isValid;

    if (!isEmailFormValid)
      return;

    const email = this.emailModel.email;

    this.userService.getUserExistence(email)
      .then(userExistenceModel => {
        if (userExistenceModel.isEntityExist)
          this.email = email;
        else
          this.alertService.error(`Unable to find user with such email: ${email}`);
      }).catch(error => this.alertService.error(error.message ? error.message : error));
  }
}
