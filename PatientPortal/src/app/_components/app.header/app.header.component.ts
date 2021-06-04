import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { Subscription } from "rxjs";
import { UserService } from 'src/app/administration/services/user.service';
import { userInfo } from 'os';

@Component({
  selector: "app-header",
  templateUrl: "./app.header.component.html",
  styleUrls: ["./app.header.component.sass"]
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  currentUserSubscription: Subscription;

  isTelehealthLinkVisible: boolean = false;
  isBleLinkVisible: boolean = false;
  isLogoutLinkVisible: boolean = false;
  isChangePasswordVisible: boolean = false;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.authenticationService
      .currentUser.subscribe(currentUser => {
        if (currentUser && currentUser.isAuthenticated) {
          this.isTelehealthLinkVisible = true;
          this.isBleLinkVisible = true;
          this.isLogoutLinkVisible = true;
          this.isChangePasswordVisible = true;
        }
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
