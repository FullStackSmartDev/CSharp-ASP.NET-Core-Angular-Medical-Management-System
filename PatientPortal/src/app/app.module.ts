import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { AppHeaderComponent } from './_components/app.header/app.header.component';
import { TelehealthModule } from './telehealth/telehealth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotAuthorizedInterceptor } from './_services/_interceptors/not-authorized.interceptor';
import { LoadingScreenInterceptor } from './_services/_interceptors/loading.interceptor';
import { AuthCookieInterceptor } from './_services/_interceptors/auth-cookie.interceptor';
import { AppLoaderComponent } from './_components/app.loader/app.loader.component';
import { CompanySwitcherComponent } from './_components/app.header/company-switcher/company-switcher.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SchedulerModule } from './scheduler/scheduler.module';
import { RegistrationModule } from './registration/registration.module';
import { AdministrationModule } from './administration/administration.module';
import { PatientsModule } from './patients/patients.module';
import { PatientChartModule } from './patientChart/patient-chart.module';
import { VideoChatModule } from './videoChat/video-chat.module';
import { DxSelectBoxModule } from 'devextreme-angular';
import { CompaniesManagementModule } from './companiesManagement/companies-management.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BatteryLevelComponent } from './ble/battery-level.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { WebRTCModule } from './webrtc/webrtc.module';
import { AngRTCModule } from './angrtc/angrtc.module';
import { ScanDocModule } from './scandoc/scandoc.module';
//import { VChatModule } from './vchat/vchat.module';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLoaderComponent,
    CompanySwitcherComponent,
    BatteryLevelComponent,
  ],
  imports: [
    NgxSpinnerModule,
    SchedulerModule,
    RegistrationModule,
    AdministrationModule,
    PatientsModule,
    PatientChartModule,
    VideoChatModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxSelectBoxModule,
    CompaniesManagementModule,
    TelehealthModule,
    WebRTCModule,
    ScanDocModule,
    AngRTCModule,
    // VChatModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing'
    }),
    WebBluetoothModule.forRoot({
      enableTracing: true
    })
  ],
  entryComponents: [
    BatteryLevelComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotAuthorizedInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthCookieInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
