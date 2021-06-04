import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/_services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from "../../../_services/authentication.service";
import {AppRouteNames} from "../../../_classes/appRouteNames";


@Component({
  selector: 'confirm-email',
  template: ''
})

export class ConfirmEmailComponent implements OnInit{

  constructor(private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const { userId, code } = this.activatedRoute.snapshot.queryParams;

    this.authenticationService.confirmEmail(userId, code)
      .then(validationResult => {
        if (validationResult.isValid) {
          this.router.navigate([AppRouteNames.resetPassword], {queryParams: {userId: userId}});
        } else {
          this.alertService.alert(
            "This key is invalid or has already been used. Please reset your password again if needed.",
            "confirm-email");
        }
      });
  }
}
