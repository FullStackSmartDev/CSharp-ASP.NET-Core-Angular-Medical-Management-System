import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import { DataService } from '../../provider/dataService';
import { TableNames } from '../../constants/tableNames';
import { DxListComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

@Component({
    templateUrl: 'permissionGroup.html',
    selector: 'permission-group'
})

export class PermissionGroupComponent implements OnInit, OnDestroy {
    isLoaderVisible:boolean = false;
    permissionGroups: any = {};
    isCreateUpdatePermissionGroupVisible: boolean = false;
    @ViewChild("permissionGroupList") permissionGroupList: DxListComponent;

    private _newOrSelectedPermissionGroup: any = {};

    constructor(private lookupDataSourceProvider: LookupDataSourceProvider,
        private dataService: DataService) {
        this.init()
    }

    get groupName(): string {
        return this._newOrSelectedPermissionGroup.Name ? this._newOrSelectedPermissionGroup.Name : "";
    }

    set groupName(groupName: string) {
        this._newOrSelectedPermissionGroup.Name = groupName;
    }

    get hasAdminPermission(): boolean {
        if (!this._newOrSelectedPermissionGroup.Permissions)
            return false;
        return JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions.hasAdminPermission;
    }

    set hasAdminPermission(hasAdminPermission: boolean) {
        let permissions = this._newOrSelectedPermissionGroup.Permissions ? JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions
            : this.createDefaultPermissions();
        permissions.hasAdminPermission = hasAdminPermission;
        this._newOrSelectedPermissionGroup.Permissions = JSON.stringify({ permissions: permissions });
    }

    get hasSyncPermission(): boolean {
        if (!this._newOrSelectedPermissionGroup.Permissions)
            return false;
        return JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions.hasSyncPermission;
    }

    set hasSyncPermission(hasSyncPermission: boolean) {
        let permissions = this._newOrSelectedPermissionGroup.Permissions ? JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions
            : this.createDefaultPermissions();
        permissions.hasSyncPermission = hasSyncPermission;
        this._newOrSelectedPermissionGroup.Permissions = JSON.stringify({ permissions: permissions });
    }

    get hasAppointmentPermission(): boolean {
        if (!this._newOrSelectedPermissionGroup.Permissions)
            return false;
        return JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions.hasAppointmentPermission;
    }

    set hasAppointmentPermission(hasAppointmentPermission: boolean) {
        let permissions = this._newOrSelectedPermissionGroup.Permissions ? JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions
            : this.createDefaultPermissions();
        permissions.hasAppointmentPermission = hasAppointmentPermission;
        this._newOrSelectedPermissionGroup.Permissions = JSON.stringify({ permissions: permissions });
    }

    get hasPatientDataPermission(): boolean {
        if (!this._newOrSelectedPermissionGroup.Permissions)
            return false;
        return JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions.hasPatientDataPermission;
    }

    set hasPatientDataPermission(hasPatientDataPermission: boolean) {
        let permissions = this._newOrSelectedPermissionGroup.Permissions ? JSON.parse(this._newOrSelectedPermissionGroup.Permissions).permissions
            : this.createDefaultPermissions();
        permissions.hasPatientDataPermission = hasPatientDataPermission;
        this._newOrSelectedPermissionGroup.Permissions = JSON.stringify({ permissions: permissions });
    }

    createNewPermissionGroupFormVisible() {
        this.isCreateUpdatePermissionGroupVisible = true;
        this._newOrSelectedPermissionGroup = {};
    }

    createUpdatePermissionGroup($event) {
        const self = this;
        this.isLoaderVisible = true;
        const createUpdatePromise = this._newOrSelectedPermissionGroup.Id ? this.dataService.update(TableNames.permissionGroup, this._newOrSelectedPermissionGroup.Id, this._newOrSelectedPermissionGroup)
            : this.dataService.create(TableNames.permissionGroup, this._newOrSelectedPermissionGroup, false);
        createUpdatePromise.then(() => {
            self.permissionGroupList.instance.reload();
            self.isLoaderVisible = false;
            notify("Permission group successfully updated", "success", 1500)
        })
        .catch(error => {
            self.isLoaderVisible = false;
            notify(error.message ? error.message : error, "error", 1500)
        })
    }

    onSelectPermissionGroup($event){
        const self = this;
        this.isLoaderVisible = true;
        const selectedPermissions = $event.addedItems;
        if(!selectedPermissions || selectedPermissions.length === 0){
            this.isLoaderVisible = false;
            return;
        }
        const selectedPermissionGroupId = selectedPermissions[0].Id;

        this.dataService.getById(TableNames.permissionGroup, selectedPermissionGroupId)
            .then(permissionGroup => {
                self.isCreateUpdatePermissionGroupVisible = true;
                self._newOrSelectedPermissionGroup = permissionGroup;
                self.isLoaderVisible = false;
            })
            .catch(error => {
                self.isLoaderVisible = false;
                console.log(error.message ? error.message : error);
            });
    }

    private createDefaultPermissions() {
        return {
            hasSyncPermission: false,
            hasAdminPermission: false,
            hasAppointmentPermission: false,
            hasPatientDataPermission: false,
        }
    }

    private init(): any {
        this.initPermissionGroupDataSource();
    }

    private initPermissionGroupDataSource() {
        this.permissionGroups.store
            = this.lookupDataSourceProvider.permissionGroupDataSource;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}