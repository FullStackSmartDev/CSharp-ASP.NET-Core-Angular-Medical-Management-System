import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { DataService } from '../provider/dataService';
import { StringHelper } from '../helpers/stringHelper';
import { SyncService } from '../provider/syncService';
import { TableNames } from '../constants/tableNames';
import { ToastService } from '../provider/toastService';
import { LoadPanelInfo, LoadPanelService } from '../provider/loadPanelService';
import { AlertInfo, DxAlertService } from '../provider/dxAlertService';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any;
  loadPanelInfo: LoadPanelInfo;
  alertInfo: AlertInfo;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private dataService: DataService,
    private syncService: SyncService, private toastService: ToastService,
    private loadPanelService: LoadPanelService, private dxAlertService: DxAlertService) {

    this.loadPanelInfo = new LoadPanelInfo();
    this.alertInfo = new AlertInfo();

    let self = this;
    platform.ready().then(() => {
      self.dataService.createTables()
        .then(() => {
          self.syncService.pull(TableNames.appUser)
            .then((usersPullResult) => {
              return self.dataService.updateFromPull(TableNames.appUser, usersPullResult);
            })
            .then(() => {
              console.log("User where updated from pull action");
              self.rootPage = LoginPage;
              statusBar.styleDefault();
              splashScreen.hide();
            })
            .catch(error => {
              const errorMessage = StringHelper.format("Unable update users information. Error: {0}",
                error.message ? error.message : error);
              self.toastService.showErrorMessage(errorMessage);
            });
        })
        .catch(error => console.log(StringHelper.format("Error during tables creation. Error: {0}", error.message)));
    });
  }

  ngOnInit() {
    this.loadPanelService.loaderStatusInfo
      .subscribe((value: LoadPanelInfo) => {
        this.loadPanelInfo = value
      });

    this.dxAlertService.alertInfo
      .subscribe((value: AlertInfo) => this.alertInfo = value);
  }
}