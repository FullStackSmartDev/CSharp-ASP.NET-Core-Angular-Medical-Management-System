import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { LoadingScreenService } from "src/app/_services/loading-screen.service";
import { debounceTime } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-loader",
  templateUrl: "./app.loader.component.html"
})
export class AppLoaderComponent implements OnInit, OnDestroy {
  loadingSubscription: Subscription;

  constructor(private loadingScreenService: LoadingScreenService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(
      debounceTime(300)
    ).subscribe((value) => {
      if (value) {
        this.spinner.show();
      }
      else {
        this.spinner.hide();
      }
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}