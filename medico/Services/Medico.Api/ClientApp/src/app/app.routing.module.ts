import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RootLoginComponent } from "./registration/components/root-login/root-login.component";
import { AppointmentSchedulerComponent } from "./scheduler/components/appointment-scheduler/appointment-scheduler.component";
import { AuthGuard } from "./_guards/auth.guard";
import { RouteRoles } from "./_models/role";
import { AdminComponent } from "./administration/components/admin/admin.component";
import { PatientsManagementComponent } from "./patients/components/patients-management.component";
import { PatientChartComponent } from "./patientChart/components/patient-chart/patient-chart.component";
import { VideoRTCComponent } from "./videoChat/components/video-rtc/video-rtc.component";
import { CompaniesManagementComponent } from './companiesManagement/components/companies-management/companies-management.component';
import { AppRouteNames } from './_classes/appRouteNames';
import { ContentManagementComponent } from './content-library/components/content-management.component';

const routes: Routes = [
    { path: AppRouteNames.login, component: RootLoginComponent },
    {
        path: AppRouteNames.appointments,
        component: AppointmentSchedulerComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.appointments }
    },
    {
        path: "",
        redirectTo: "/appointments",
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.patientsManagement },
        pathMatch: "full"
    },
    // {
    //     path: AppRouteNames.videoChat,
    //     component: VideoRTCComponent,
    //     canActivate: [AuthGuard],
    //     data: { roles: RouteRoles.appointments }
    // },
    {
        path: AppRouteNames.administration,
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.administration }
    },
    {
        path: AppRouteNames.companiesManagement,
        component: CompaniesManagementComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.companiesManagement }
    },
    {
        path: AppRouteNames.library,
        component: ContentManagementComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.libraryManagement }
    },
    {
        path: AppRouteNames.patientsManagement,
        component: PatientsManagementComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.patientsManagement }
    },
    {
        path: AppRouteNames.library,
        component: ContentManagementComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.libraryManagement }
    },
    {
        path: `${AppRouteNames.patientChart}/:appointmentId`,
        component: PatientChartComponent,
        canActivate: [AuthGuard],
        data: { roles: RouteRoles.patientChart }
    },
    { path: "**", redirectTo: "appointments", pathMatch: "full" }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }