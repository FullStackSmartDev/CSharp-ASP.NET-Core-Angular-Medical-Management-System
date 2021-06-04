import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { Subscription } from "rxjs";
import { Role, RouteRoles } from "src/app/_models/role";

@Component({
  selector: "app-header",
  templateUrl: "./app.header.component.html",
  styleUrls: ["./app.header.component.sass"]
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  currentUserSubscription: Subscription;

  isAppointmentsLinkVisible: boolean = false;
  isPatientsLinkVisible: boolean = false;
  isAdministrationLinkVisible: boolean = false;
  isLogoutLinkVisible: boolean = false;
  isCompaniesManagementLinkVisible: boolean = false;

  isCompanySwitcherVisible: boolean = false;

  constructor(private authenticationService: AuthenticationService) {

  }
  
  ngOnInit(): void {
    this.currentUserSubscription = this.authenticationService
      .currentUser.subscribe(currentUser => {
        this.isCompaniesManagementLinkVisible = currentUser && currentUser
          .isUserInRole(Role.SuperAdmin);

        this.isAdministrationLinkVisible = currentUser && currentUser
          .isUserHaveAtLeastOneRole(RouteRoles.administration);

        this.isAppointmentsLinkVisible = currentUser && currentUser
          .isUserHaveAtLeastOneRole(RouteRoles.appointments);

        this.isPatientsLinkVisible = currentUser && currentUser
          .isUserHaveAtLeastOneRole(RouteRoles.patientsManagement);

        this.isLogoutLinkVisible = currentUser && currentUser
          .isUserHaveAtLeastOneRole([]);

        this.isCompanySwitcherVisible = currentUser && currentUser.isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  logout($event): void {
    $event.preventDefault();
    this.authenticationService.logout()
      .then(() => {
        location.reload();
      });
  }
}