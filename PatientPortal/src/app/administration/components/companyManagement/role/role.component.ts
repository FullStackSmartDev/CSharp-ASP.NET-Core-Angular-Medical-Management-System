import { Component } from '@angular/core';
import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { AlertService } from 'src/app/_services/alert.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: 'role',
    templateUrl: './role.component.html'
})
export class RoleComponent extends BaseAdminComponent {
    roleDataSource: any = {};

    constructor(private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {
        super();

        this.init();
    }

    private init(): void {
        this.initRoleDataSource();
    }

    private initRoleDataSource(): void {
        this.roleDataSource = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("role"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}