import { NgModule } from '@angular/core';
import { RootLoginComponent } from './components/root-login/root-login.component';
import { DxFormModule, DxButtonModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ConfirmEmailComponent } from "./components/confirm-email/confirm-email.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {ChangePasswordComponent} from "./components/changepassword/changepassword.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";


@NgModule({
    imports: [
        DxFormModule,
        DxButtonModule,
        CommonModule
    ],
    declarations: [
      RootLoginComponent,
      LoginComponent,
      ConfirmEmailComponent,
      ResetPasswordComponent,
      ChangePasswordComponent,
      ForgotPasswordComponent
    ]
})
export class RegistrationModule { }
