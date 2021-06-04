import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { TelehealthComponent } from './telehealth/telehealth.component';
import { RootLoginComponent } from './registration/components/root-login/root-login.component';
import { AppRouteNames } from './_classes/appRouteNames';
import { AuthGuard } from './_guards/auth.guard';
import { BatteryLevelComponent } from './ble/battery-level.component';
import { ForgotPasswordComponent } from './registration/components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './registration/components/changepassword/changepassword.component';
import { WebRTCComponent } from './webrtc/webrtc.component';
import { AngRTCComponent } from './angrtc/angrtc.component';
import { ScanDocComponent } from './scandoc/scandoc.component';
import {ConfirmEmailComponent} from "./registration/components/confirm-email/confirm-email.component";
import {ResetPasswordComponent} from "./registration/components/reset-password/reset-password.component";

const routes: Routes = [
  {
    path: AppRouteNames.login,
    component: RootLoginComponent
  },
  {
    path: AppRouteNames.confirmEmail,
    component: ConfirmEmailComponent
  },
  {
    path: AppRouteNames.resetPassword,
    component: ResetPasswordComponent
  },
  {
    path: AppRouteNames.changePassword,
    component: ChangePasswordComponent
  },
  {
    path: AppRouteNames.forgotPassword,
    component: ForgotPasswordComponent
  },
  {
    path: AppRouteNames.telehealth,
    component: TelehealthComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AppRouteNames.angRTC,
    component: AngRTCComponent
  },
  {
    path: AppRouteNames.webRTC,
    component: WebRTCComponent
  },
  {
    path: AppRouteNames.scanDOC,
    component:ScanDocComponent
  },
  {
    path: AppRouteNames.ble,
    component: BatteryLevelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: AppRouteNames.telehealth,
    pathMatch: "full"
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
