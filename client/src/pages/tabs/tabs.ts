import { Component, OnInit } from '@angular/core';
import { PatientDataPage } from "../patientData/patientData"
import { AppointmentsPage } from "../appointments/appointmentsComponent"
import { AdministrationPage } from "../administration/administration"
import { AuthorizationService } from '../../provider/authorizationService';
import { PatientManagementPage } from '../patientManagementPage/patientManagementPage';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage implements OnInit {

  tabs: Array<any> = [{ title: "Appointments", root: AppointmentsPage, icon: "home" }];

  hasAdminPermission: boolean = false;
  hasAppointmentPermission: boolean = false;
  hasPatientDataPermission: boolean = false;
  hasSyncPermission: boolean = false;
  hasPermission: boolean = false;

  constructor(private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    const currentUser = this.authorizationService.currentUser;
    const isCurrentUserSuperAdmin = currentUser.IsSuperAdmin;
    if (isCurrentUserSuperAdmin) {
      this.hasAppointmentPermission = true;
      this.hasPatientDataPermission = true;
      this.hasAdminPermission = true;
      this.hasSyncPermission = true;
      this.setTabsAccordingPermissions();
      return;
    }
    const self = this;
    this.authorizationService.currentUserPermissionGroups
      .then(groups => {
        //so far we use first group but we need merge permissions in group if we have more than one group
        if (!groups || groups.length === 0) {
          return;
        }

        const group = groups[0];
        const permissions = JSON.parse(group.GroupPermissions).permissions;

        self.hasAppointmentPermission = permissions.hasAppointmentPermission;
        self.hasPatientDataPermission = permissions.hasPatientDataPermission;
        self.hasAdminPermission = permissions.hasAdminPermission;
        self.hasSyncPermission = permissions.hasSyncPermission;
        self.setTabsAccordingPermissions();
      });
  }

  private setTabsAccordingPermissions(){
    const hasAppointmentPermission = this.hasAppointmentPermission;
    if (this.hasAdminPermission) {
      if (hasAppointmentPermission) {
        this.tabs.push({ title: "Administration", root: AdministrationPage, icon: "home" })
      }
      else {
        this.tabs[0] = { title: "Administration", root: AdministrationPage, icon: "home" };
      }
    }
    
    if (this.hasPatientDataPermission) {
      this.tabs.push({ title: "Patient Data", root: PatientDataPage, icon: "home" })
    }

    this.tabs.push({ title: "Patients", root: PatientManagementPage, icon: "home" })
  }
}