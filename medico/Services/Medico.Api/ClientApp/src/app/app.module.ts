import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RegistrationModule } from './registration/registration.module';
import { AppHeaderComponent } from './_components/app.header/app.header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { AppLoaderComponent } from './_components/app.loader/app.loader.component';
import { LoadingScreenInterceptor } from './_services/_interceptors/loading.interceptor';
import { SchedulerModule } from './scheduler/scheduler.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdministrationModule } from './administration/administration.module';
import { PatientsModule } from './patients/patients.module';
import { PatientChartModule } from './patientChart/patient-chart.module';
import { VideoChatModule } from './videoChat/video-chat.module';
import { CompanySwitcherComponent } from './_components/app.header/company-switcher/company-switcher.component';
import { DxSelectBoxModule } from 'devextreme-angular';
import { CompaniesManagementModule } from './companiesManagement/companies-management.module';
import { AuthCookieInterceptor } from './_services/_interceptors/auth-cookie.interceptor';
import { NotAuthorizedInterceptor } from './_services/_interceptors/not-authorized.interceptor';
import { ContentLibraryModule } from './content-library/content-library.module';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLoaderComponent,
    CompanySwitcherComponent,
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
    ContentLibraryModule
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
