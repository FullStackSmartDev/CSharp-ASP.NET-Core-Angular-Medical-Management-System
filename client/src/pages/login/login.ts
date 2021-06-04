import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AuthorizationService } from '../../provider/authorizationService';
import { DataSynchronizationService } from '../../provider/dataSynchronizationService';
import { TableNames } from '../../constants/tableNames';
import { TabsPage } from '../tabs/tabs';
import { ToastService } from '../../provider/toastService';
import { StringHelper } from '../../helpers/stringHelper';

@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})
export class LoginPage {
    private email: string;
    private password: string;
    private loading: Loading;
    private loadingMessage: string = "Please, wait...";

    constructor(public navCtrl: NavController,
        private authorizationService: AuthorizationService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private dataSynchronizationService: DataSynchronizationService,
        private toastService: ToastService) {
    }

    loginClick() {
        this.showLoading();
        this.authorizationService.authorize(this.email, this.password)
            .then(isAuthorized => {
                if (isAuthorized) {
                    // this.navCtrl.setRoot(TabsPage);
                    this.dataSynchronizationService.synchronizeTables([TableNames.appUser])
                        .then(() => {
                            this.navCtrl.setRoot(TabsPage);
                        })
                        .catch(error => {
                            this.toastService.showErrorMessage(StringHelper.format("Data synchronization is not available. Error:{0}", error.message ? error.message : error));
                            this.navCtrl.setRoot(TabsPage);
                        });
                }
                else
                    this.showError("Access denied");
            }, () => this.showError("Login failed"))

    }

    showLoading() {
        const self = this;
        this.loading = this.loadingCtrl.create({
            content: self.loadingMessage,
            dismissOnPageChange: true
        });
        this.loading.present();
    }

    showError(text) {
        this.loading.dismiss();

        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
}