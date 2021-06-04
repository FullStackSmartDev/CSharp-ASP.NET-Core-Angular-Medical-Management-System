import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { BaseComponent } from '../baseComponent';
import { DataService } from '../../provider/dataService';
import { ToastService } from '../../provider/toastService';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import { CryptoService } from '../../provider/cryptoService';
import * as moment from 'moment';
import { Employee } from '../../dataModels/employee';
import { AppUser } from '../../dataModels/appUser';
import { EmployeeDataService, AppUserDataService, AppUserPermissionGroupDataService, AppointmentDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { UserPermissionGroupViewDataService, EmployeeWithPermissionGroupViewDataService } from '../../provider/dataServices/read/readDataServices';
import { LoadPanelService } from '../../provider/loadPanelService';
import { TableNames } from '../../constants/tableNames';
import { ExtraFieldsAppService } from '../../provider/appServices/extraFieldsAppService';
import { AppUserPermissionGroup } from '../../dataModels/appUserPermissionGroup';
import { ExtraFieldsTabComponent } from './extraFieldsTabComponent';
import { CompanyIdService } from '../../provider/companyIdService';
import CustomStore from 'devextreme/data/custom_store';
import { alert } from 'devextreme/ui/dialog';
import { Appointment } from '../../dataModels/appointment';
import { confirm } from 'devextreme/ui/dialog';
import { LookupItemsAppService, LookupItemListMetadata } from '../../provider/appServices/lookupItemsAppService';
import { ControlDefaultValues } from '../../constants/controlDefaultValues';

@Component({
    templateUrl: 'employeeManagementComponent.html',
    selector: 'employee-management'
})

export class EmployeeManagementComponent extends BaseComponent implements AfterViewInit {
    @ViewChild("employeeDataGrid") employeeDataGrid: DxDataGridComponent;
    @ViewChild("employeeCreationForm") employeeCreationForm: DxFormComponent;
    @ViewChild("createUpdateLocationPopup") createUpdateLocationPopup: DxPopupComponent;
    //@ViewChild("extraFieldsTab") extraFieldsTab: ExtraFieldsTabComponent;

    employeeDataSource: any = {};
    locationDataSource: any = {};
    permissionGroupDataSource: any = {};


    employeeData: any = {
        IsActive: true,
        NamePrefix: ControlDefaultValues.selectBox,
        NameSuffix: ControlDefaultValues.selectBox
    }

    selectedEmployees: Array<any> = [];

    isCreateUpdatePopupOpened: boolean = false;

    isNewEmployee: boolean = true;
    isEmployeeSet: boolean = false;

    constructor(dataService: DataService, toastService: ToastService,
        private appointmentDataService: AppointmentDataService,
        private lookupDataSourceProvider: LookupDataSourceProvider,
        private loadPanelService: LoadPanelService,
        private cryptoService: CryptoService,
        private employeeDataService: EmployeeDataService,
        private appUserDataService: AppUserDataService,
        private employeeWithPermissionGroupViewDataService: EmployeeWithPermissionGroupViewDataService,
        private userPermissionGroupViewDataService: UserPermissionGroupViewDataService,
        private extraFieldsAppService: ExtraFieldsAppService,
        private appUserPermissionGroupDataService: AppUserPermissionGroupDataService,
        private companyIdService: CompanyIdService,
        private lookupItemsAppService: LookupItemsAppService) {
        super(dataService, toastService);

        this.init();
    }

    // onExtraFieldsTabCreated($event) {
    //     if ($event) {
    //         this.employeeCreationForm.items[0]["tabs"].push($event);
    //         this.employeeCreationForm.instance.repaint();
    //     }
    // }

    openCreateEmployeeForm() {
        this.isEmployeeSet = true;
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateEmployeeForm();
    }

    deleteEmployee(employee: any, $event: any) {
        $event.stopPropagation();

        this.loadPanelService
            .showLoader();

        const employeeId = employee.Id;
        const employeeType = employee.EmployeeType;

        const employeeTypeEnum = this.lookups.employeeType
            .filter(s => s.Name === employeeType)[0].Value;

        this.canDeactivateDeleteEmployee(employeeId, employeeTypeEnum)
            .then(canDelete => {
                this.loadPanelService
                    .hideLoader();

                if (!canDelete) {
                    alert("Employee already is used. You cannot delete it.", "WARNING");
                    return;
                }

                this.continueDeletingEmployee(employeeId);
            });
    }

    onEmployeeFieldChanged($event) {
        const dataField = $event.dataField;
        if (!this.isNewEmployee && dataField === "IsActive" && !$event.value) {
            this.loadPanelService.showLoader();

            const employeeId = this.employeeData.Id;
            const employeeType = this.employeeData.EmployeeType;

            this.canDeactivateDeleteEmployee(employeeId, employeeType)
                .then(canDeactivate => {
                    this.loadPanelService.hideLoader();

                    if (!canDeactivate) {
                        this.employeeData.IsActive = 1;
                        alert("Employee already is used. You cannot deactivate it.", "WARNING");
                    }
                });
        }
    }

    ngAfterViewInit(): void {
        this.createUpdateLocationPopup.instance
            .registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            });

        // this.extraFieldsAppService
        //     .addExtraColumnsToGridIfNeeded(TableNames.employee, this.employeeDataGrid);
    }

    onEmployeeSelected($event) {
        const employee = $event.selectedRowsData[0];
        if (!employee)
            return;

        this.loadPanelService
            .showLoader();

        const employeeId = employee.Id;

        this.employeeDataService.getById(employeeId)
            .then(employee => {
                this.setEmployeeDataFromEmployee(employee);
                return this.appUserDataService.getById(employee.AppUserId);;
            })
            .then(user => {
                this.setEmployeeDataFromUser(user);
                return this.getUserPermissionGroup(user.Id);
            })
            .then(userGroup => {
                this.employeeData.PermissionGroupId = userGroup.PermissionGroupId;

                this.loadPanelService
                    .hideLoader();

                this.isNewEmployee = false;
                this.isEmployeeSet = true;
                this.isCreateUpdatePopupOpened = true;
            })
            .catch(error => {
                this.loadPanelService
                    .hideLoader();

                this.toastService
                    .showErrorMessage(`Error ${error.message ? error.message : error}`);
            });
    }

    getEmployeeInfo(gridItem) {
        const middleName = gridItem.MiddleName;
        const firstName = gridItem.FirstName;
        const lastName = gridItem.LastName;

        const dateOfBirth = moment(gridItem.DateOfBirth).format("DD/MM/YYYY");

        const employeeName = middleName
            ? `${firstName} ${middleName} ${lastName}`
            : `${firstName} ${lastName}`;

        return `${employeeName} DOB: ${dateOfBirth}`;
    }

    createUpdateEmployee() {
        const validationResult = this.employeeCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewEmployee) {
            this.createEmployeeAndRelatedEntities();
        }
        else {
            this.updateEmployeeAndRelatedEntities();
        }
    }

    private continueDeletingEmployee(employeeId: any): void {
        const confirmationPopup = confirm("Are you sure you want to delete the employee ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.loadPanelService
                    .showLoader();

                const filter = `WHERE Id = '${employeeId}'`;

                this.employeeDataService.getById(employeeId)
                    .then((employee) => {
                        const appUserId = employee.AppUserId;

                        this.employeeDataService.delete(filter, employee)
                            .then(() => {
                                const appUserPromise = this.appUserDataService
                                    .getById(appUserId);

                                const loadOptions = {
                                    filter: ["AppUserId", "=", appUserId]
                                }
                                const appUserPermissionGroup = this.appUserPermissionGroupDataService
                                    .firstOrDefault(loadOptions);

                                Promise.all([appUserPromise, appUserPermissionGroup])
                                    .then(result => {
                                        const appUser = result[0];
                                        const appUserPermissionGroup = result[1];

                                        const appUserDeleteFilter = `WHERE Id = '${appUser.Id}'`;
                                        const appUserDeletePromise = this.appUserDataService
                                            .delete(appUserDeleteFilter, appUser);

                                        const appUserPermissionGroupDeleteFilter = `WHERE AppUserId = '${appUser.Id}'`;
                                        const appUserPermissionGroupDeletePromise = this.appUserPermissionGroupDataService
                                            .delete(appUserPermissionGroupDeleteFilter, appUserPermissionGroup);

                                        Promise.all([appUserDeletePromise, appUserPermissionGroupDeletePromise])
                                            .then(() => {
                                                this.employeeDataGrid.instance.refresh();
                                                this.loadPanelService.hideLoader();
                                            });
                                    });
                            });
                    });
            }
        });
    }

    private canDeactivateDeleteEmployee(employeeId: string,
        employeeType: number): Promise<boolean> {

        //1 - Physician
        //2 - Nurse
        if (employeeType === 1 || employeeType === 2) {
            const employeeIdName = employeeType === 1
                ? "PhysicianId"
                : "NurseId";

            const filter = [employeeIdName, "=", employeeId];
            const loadOptions = {
                filter: filter
            }

            return this.appointmentDataService
                .firstOrDefault(loadOptions)
                .then(appointment => !appointment);
        }

        return Promise.resolve(true);
    }

    private resetCreateUpdateEmployeeForm() {
        this.isEmployeeSet = false;
        this.isNewEmployee = true;
        this.selectedEmployees = [];
        this.employeeData = {
            IsActive: true
        };
    }

    private setEmployeeDataFromUser(appUser: AppUser): void {
        this.employeeData.Email = appUser.Login;
        this.employeeData.Password = this.cryptoService.decrypt(appUser.Hash);
    }

    private getUserPermissionGroup(userId: string): Promise<any> {
        const appUserFilter = ["AppUserId", "=", userId];
        const nonDeletedUserFilter = ["AppUser_IsDelete", "=", false];
        const nonDeletedPermissionGroupFilter = ["AppUserPermissionGroup_IsDelete", "=", false];

        const filter = [appUserFilter, "and", nonDeletedUserFilter, "and", nonDeletedPermissionGroupFilter];

        const loaadOptions = { filter: filter };

        return this.userPermissionGroupViewDataService
            .firstOrDefault(loaadOptions)
    }

    private createEmployeeAndRelatedEntities(): void {
        this.loadPanelService
            .showLoader();

        this.createNewUser()
            .then((newUser) => {
                return this.createNewEmployee(newUser.Id);
            })
            .then((newEmployee) => {
                return this.mapPermissionGroupToUser(newEmployee.AppUserId, this.employeeData.PermissionGroupId);
            })
            // .then(() => {
            //     return this.extraFieldsTab
            //         .saveExtraFields();
            // })
            .then(() => {
                this.resetCreateUpdateEmployeeForm();
                this.isCreateUpdatePopupOpened = false;
                this.employeeDataGrid.instance.refresh();

                this.loadPanelService
                    .hideLoader();

                this.toastService.showSuccessMessage("Employee was created successfully");
            })
            .catch(error => {
                this.loadPanelService
                    .hideLoader();
                this.toastService.showErrorMessage(`Error ${error.message ? error.message : error}`)
            });
    }


    private updateEmployeeAndRelatedEntities(): void {
        const updateEmployeePromise =
            this.updateEmployee();

        const updateUserPromise =
            this.updateUser();

        const updatePermissionGroupPromise =
            this.updatePermissionGroup();

        this.loadPanelService.showLoader();

        Promise.all([updateEmployeePromise, updateUserPromise, updatePermissionGroupPromise])
            // .then(() => {
            //     return this.extraFieldsTab
            //         .saveExtraFields();
            // })
            .then(() => {
                this.resetCreateUpdateEmployeeForm();
                this.isCreateUpdatePopupOpened = false;
                this.employeeDataGrid.instance.refresh();

                this.loadPanelService.hideLoader();

                this.toastService.showSuccessMessage("Employee was updated successfully");
            })
            .catch(error => {
                this.loadPanelService
                    .hideLoader();
                this.toastService.showErrorMessage(`Error ${error.message ? error.message : error}`)
            });
    }

    private updateEmployee(): Promise<any> {
        const employeeId = this.employeeData.Id;
        return this.employeeDataService
            .getById(employeeId)
            .then((employee) => {
                this.setEmployeeFromEmployeeData(employee);
                return this.employeeDataService
                    .update(employee);
            });
    }

    private updateUser(): Promise<any> {
        const userId = this.employeeData.AppUserId
        return this.appUserDataService
            .getById(userId)
            .then(user => {
                user.Login = this.employeeData.Email;
                user.Hash = this.cryptoService.encrypt(this.employeeData.Password);

                return this.appUserDataService
                    .update(user);
            })
    }

    private updatePermissionGroup(): Promise<any> {
        const loadOptions = {
            filter: ["AppUserId", "=", this.employeeData.AppUserId]
        }

        return this.appUserPermissionGroupDataService
            .firstOrDefault(loadOptions)
            .then(appUserPermissionGroup => {
                const oldPermissionGroupId = appUserPermissionGroup.PermissionGroupId;

                appUserPermissionGroup.PermissionGroupId
                    = this.employeeData.PermissionGroupId;

                const customFilter = [
                    ["AppUserId", "=", appUserPermissionGroup.AppUserId],
                    "and",
                    ["PermissionGroupId", "=", oldPermissionGroupId]
                ];

                return this.appUserPermissionGroupDataService
                    .update(appUserPermissionGroup, customFilter);
            });
    }

    private init(): void {
        this.initEmployeeDataSource();
        this.initLocationDataSource();
        this.initPermissionGroupDataSource();
        this.setLookupItemListValues();
    }

    private setLookupItemListValues() {
        const lookupItemListNames = [
            new LookupItemListMetadata("nameSuffix", true),
            new LookupItemListMetadata("namePrefix", true)
        ];
        
        this.lookupItemsAppService
            .setLookupItemLists(lookupItemListNames, this);
    }

    private initLocationDataSource(): any {
        this.locationDataSource.store = this.lookupDataSourceProvider.locationLookupDataSource;
    }

    private initPermissionGroupDataSource() {
        this.permissionGroupDataSource.store
            = this.lookupDataSourceProvider.permissionGroupDataSource;
    }

    private initEmployeeDataSource(): any {
        this.employeeDataSource.store =
            new CustomStore({
                byKey: (key) => {
                    return this.employeeDataService
                        .getById(key);
                },
                load: (loadOptions: any) => {
                    return this.employeeWithPermissionGroupViewDataService
                        .searchWithCount(loadOptions, "Id")
                        .then(searchResult => {
                            searchResult.data.forEach(employee => {
                                this.adjustEmployeeBeforeRenderInGrid(employee);
                            });
                            return searchResult;
                        })
                        .catch(error => this.toastService.showErrorMessage(error.message ? error.message : error));
                }
            });
        // this.extraFieldsAppService
        //     .getExtraFieldDataSource(this.employeeWithPermissionGroupViewDataService, TableNames.employee, "Id", this.adjustEmployeeBeforeRenderInGrid, this);
    }

    private adjustEmployeeBeforeRenderInGrid(employee: Employee) {
        employee.State = this.lookups.state
            .filter(s => s.Value === employee.State)[0].Name;
        employee.EmployeeType = this.lookups.employeeType
            .filter(s => s.Value === employee.EmployeeType)[0].Name;
    }

    private createNewUser(): Promise<any> {
        const newUser = new AppUser();
        const encryptedPassword = this.cryptoService
            .encrypt(this.employeeData.Password);

        newUser.Hash = encryptedPassword;
        newUser.Login = this.employeeData.Email;

        return this.appUserDataService.create(newUser)
            .then(createdUser => {
                return createdUser;
            })
            .catch(error => {
                this.toastService.showErrorMessage(error.message ? error.message : error);
            });
    }

    private setEmployeeFromEmployeeData(employee: Employee): void {
        employee.FirstName = this.employeeData.FirstName;
        employee.LastName = this.employeeData.LastName;
        employee.MiddleName = this.employeeData.MiddleName;
        employee.Gender = this.employeeData.Gender;
        employee.IsActive = this.employeeData.IsActive;
        employee.DateOfBirth = this.employeeData.DateOfBirth;
        employee.Address = this.employeeData.Address;
        employee.SecondaryAddress = this.employeeData.SecondaryAddress
            ? this.employeeData.SecondaryAddress
            : "";
        employee.SecondaryPhone = this.employeeData.SecondaryPhone
            ? this.employeeData.SecondaryPhone
            : "";
        employee.City = this.employeeData.City;
        employee.State = this.employeeData.State;
        employee.Zip = this.employeeData.Zip;
        employee.PrimaryPhone = this.employeeData.PrimaryPhone;
        employee.Ssn = this.employeeData.Ssn;
        employee.EmployeeType = this.employeeData.EmployeeType;

        employee.NamePrefix = this.employeeData.NamePrefix === ControlDefaultValues.selectBox
            ? null
            : this.employeeData.NamePrefix;

        employee.NameSuffix = this.employeeData.NameSuffix === ControlDefaultValues.selectBox
            ? null
            : this.employeeData.NameSuffix;

        employee.convertToEntityModel();
    }

    private setEmployeeDataFromEmployee(employee: Employee): void {
        this.employeeData.Id = employee.Id;
        this.employeeData.FirstName = employee.FirstName;
        this.employeeData.LastName = employee.LastName;
        this.employeeData.MiddleName = employee.MiddleName;
        this.employeeData.Gender = employee.Gender;
        this.employeeData.IsActive = employee.IsActive;
        this.employeeData.DateOfBirth = employee.DateOfBirth;
        this.employeeData.Address = employee.Address;
        this.employeeData.SecondaryAddress = employee.SecondaryAddress;
        this.employeeData.SecondaryPhone = employee.SecondaryPhone;
        this.employeeData.City = employee.City;
        this.employeeData.State = employee.State;
        this.employeeData.Zip = employee.Zip;
        this.employeeData.PrimaryPhone = employee.PrimaryPhone;
        this.employeeData.Ssn = employee.Ssn;
        this.employeeData.EmployeeType = employee.EmployeeType;
        this.employeeData.AppUserId = employee.AppUserId;

        this.employeeData.NamePrefix = employee.NamePrefix
            ? employee.NamePrefix
            : ControlDefaultValues.selectBox;

        this.employeeData.NameSuffix = employee.NameSuffix
            ? employee.NameSuffix
            : ControlDefaultValues.selectBox;
    }

    private createNewEmployee(userId: string): Promise<any> {
        const newEmployee = new Employee();

        this.employeeData.Id = newEmployee.Id;

        newEmployee.FirstName = this.employeeData.FirstName;
        newEmployee.LastName = this.employeeData.LastName;
        newEmployee.MiddleName = this.employeeData.MiddleName;
        newEmployee.Gender = this.employeeData.Gender;
        newEmployee.IsActive = this.employeeData.IsActive;
        newEmployee.DateOfBirth = this.employeeData.DateOfBirth;
        newEmployee.Address = this.employeeData.Address;
        newEmployee.SecondaryAddress = this.employeeData.SecondaryAddress
            ? this.employeeData.SecondaryAddress
            : "";
        newEmployee.SecondaryPhone = this.employeeData.SecondaryPhone
            ? this.employeeData.SecondaryPhone
            : "";
        newEmployee.City = this.employeeData.City;
        newEmployee.State = this.employeeData.State;
        newEmployee.Zip = this.employeeData.Zip;
        newEmployee.PrimaryPhone = this.employeeData.PrimaryPhone;
        newEmployee.Ssn = this.employeeData.Ssn;
        newEmployee.EmployeeType = this.employeeData.EmployeeType;
        newEmployee.NamePrefix = this.employeeData.NamePrefix;
        newEmployee.NameSuffix = this.employeeData.NameSuffix;
        newEmployee.AppUserId = userId;
        newEmployee.CompanyId = this.companyIdService.companyId;

        this.employeeData.NamePrefix = this.employeeData.NamePrefix === ControlDefaultValues.selectBox
            ? null
            : this.employeeData.NamePrefix;

        this.employeeData.NameSuffix = this.employeeData.NameSuffix === ControlDefaultValues.selectBox
            ? null
            : this.employeeData.NameSuffix;

        newEmployee.convertToEntityModel();

        return this.employeeDataService
            .create(newEmployee);
    }

    private mapPermissionGroupToUser(appUserId: string, permissionGroupId: string) {
        const appUserPermissionGroup = new AppUserPermissionGroup();

        appUserPermissionGroup.AppUserId = appUserId;
        appUserPermissionGroup.PermissionGroupId = permissionGroupId;

        return this.appUserPermissionGroupDataService
            .create(appUserPermissionGroup);
    }
}