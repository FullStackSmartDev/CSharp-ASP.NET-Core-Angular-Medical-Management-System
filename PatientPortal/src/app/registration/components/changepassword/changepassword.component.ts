import { Component, Input } from "@angular/core";
import { DxFormComponent } from 'devextreme-angular';
import { AlertService } from 'src/app/_services/alert.service';
import { UserService } from 'src/app/administration/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: "changepassword",
  templateUrl: "./changepassword.component.html"
})
export class ChangePasswordComponent {
  @Input() email: string;

  constructor(private toastr: ToastrService, private router: Router) { }

  btnForgetPassword() {
    this.toastr.success('Password Changed', 'Change Password', {
      positionClass: 'toast-top-right'
    });
  }
  ngOnInit() {
    //this.initUserCompanies()
    //this.loginModel.email = this.email;
    //this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  backToEmailForm(): void {
    this.router.navigate(['/root-login'])
  }
}
