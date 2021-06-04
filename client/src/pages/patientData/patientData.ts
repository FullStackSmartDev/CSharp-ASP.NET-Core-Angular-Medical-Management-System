import { Component, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { PatienDataModelService } from '../../provider/patienDataModelService';
import { DataService } from '../../provider/dataService';
import { StringHelper } from '../../helpers/stringHelper';
import { TableNames } from '../../constants/tableNames';
import { PatientDataModelTrackService } from '../../provider/patientDataModelTrackService';
import { PatientAdmissionSectionModel } from '../../directive/htmlOutletDirective';
import { PatientChartHeaderData } from '../../components/patientChartHeader/patientChartHeaderComponent';
import { Subscription } from 'rxjs';
import { Admission } from '../../dataModels/admission';
import { LoadPanelService } from '../../provider/loadPanelService';
import { DxTreeViewComponent } from 'devextreme-angular';
import { WindowService } from '../../provider/windowService';
import { SignatureInfoAppService } from '../../provider/appServices/signatureInfoAppService';
import { AlertService } from '../../provider/alertService';
import { ToastService } from '../../provider/toastService';

@Component({
    templateUrl: 'patientData.html'
})
export class PatientDataPage implements AfterViewInit {
    @ViewChild("treeView") treeView: DxTreeViewComponent;

    patientAdmissionModelTree: Array<any>;
    currentPatientAdmissionModel: any;
    currentPatientAdmission: Admission;
    patientId: string;
    appointmentId: string;
    patientChartHeaderData: PatientChartHeaderData = null;

    patientAdmissionSectionModel: PatientAdmissionSectionModel;

    getPatientAdmissionPromise: Promise<any>;

    renderPdfBtnOptions: any;
    patientAdmissionSection: any;

    savePatientAdmissionBtnText: string = "Save"
    savePatientAdmissionBtnType: string = "default"

    makeReportBtnText: string = "Report"
    makeReportBtnType: string = "default"

    signOffBtnText: string = "Sign Off"
    signOffBtnType: string = "default"

    patientDataModelTrackSubscription: Subscription;

    currentlyOpenedSection: any = null;

    isReportPopupOpened: boolean = false;
    appointmentStartDate: any;

    constructor(
        private signatureInfoAppService: SignatureInfoAppService,
        public navCtrl: NavController,
        private wionowService: WindowService,
        private patienDataModelService: PatienDataModelService,
        private navParams: NavParams,
        private dataService: DataService,
        private patientDataModelTrackService: PatientDataModelTrackService,
        private loadPanelService: LoadPanelService,
        private alertService: AlertService,
        private toastService: ToastService) {

        const appointmentInfo = this.navParams.get("appointmentInfo");
        if (!appointmentInfo)
            throw "Appointment info should be specified";

        const appointmentId = appointmentInfo.appointmentId;

        if (!appointmentId) {
            throw "Appointment Id should be specified";
        }

        this.appointmentId = appointmentId;

        this.appointmentStartDate = appointmentInfo
            .appointmentStartDate;

        this.getPatientAdmissionPromise = this.patienDataModelService
            .getPatientAdmission(appointmentId)
            .then((admission) => {
                this.currentPatientAdmission = admission;
                this.currentPatientAdmissionModel = JSON.parse(admission.AdmissionData);
                this.patientAdmissionModelTree = [this.patienDataModelService
                    .getPatientDataModelTreeProjection(this.currentPatientAdmissionModel.patientRoot, admission.IsSignedOff)];

                this.patientId = admission.PatientDemographicId;

                this.proceedSignedOff();
            })
            .catch(error => {
                const errorMessage = error.message ? error.message : error;
                this.alertService.error(errorMessage);
            });
    }

    ngAfterViewInit(): void {
        this.adjustTreeViewHeight();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.adjustTreeViewHeight();
    }

    isSignedOff: boolean = false;

    ionViewWillLeave() {
        this.patientDataModelTrackSubscription
            .unsubscribe()
    }

    ionViewWillEnter() {
        this.patientDataModelTrackSubscription =
            this.patientDataModelTrackService.patientDataModelChanged
                .subscribe((isPatientAdmissionModelChanged) => {
                    if (!isPatientAdmissionModelChanged)
                        return;
                    this.savePatientAdmission()
                        .then(() => {
                            let patientAdmissionModelTreeSnapshot = this.patientAdmissionModelTree
                            this.patientAdmissionModelTree = [this.patienDataModelService
                                .getPatientDataModelTreeProjection(this.currentPatientAdmissionModel.patientRoot, this.isSignedOff)];

                            this.restoreTreeState(this.patientAdmissionModelTree, patientAdmissionModelTreeSnapshot);

                            this.setPatientChartHeaderData();
                        })
                        .catch(error => {
                            const errorMessage = error.message ? error.message : error;
                            this.alertService.error(errorMessage);
                        })

                });

        this.getPatientAdmissionPromise
            .then(() => this.setPatientChartHeaderData());
    }

    restoreTreeState(tree, treeSnapshot) {
        for (let i = 0; i < tree.length; i++) {
            tree[i].expanded = treeSnapshot[i] ? treeSnapshot[i].expanded : false;
            if (tree[i].items.length) {
                this.restoreTreeState(tree[i].items, treeSnapshot[i].items);
            }
        }
    }

    signOff(): void {
        this.loadPanelService.showLoader();

        this.signatureInfoAppService.signOffPatientAdmission(this.currentPatientAdmission)
            .then(() => {
                this.isSignedOff = true;

                this.patientAdmissionModelTree = [this.patienDataModelService
                    .getPatientDataModelTreeProjection(this.currentPatientAdmissionModel.patientRoot, true)];

                if (this.currentlyOpenedSection) {
                    this.onPatientAdmissionSectionSelected(this.currentlyOpenedSection)
                }

                this.loadPanelService.hideLoader();
                this.alertService.alert("Document was signed off successfully", "Info");

            }).catch(error => {
                this.loadPanelService.hideLoader();
                this.alertService.alert(error.message ? error.message : error, "Error happened.");
            });
    }

    selectPatientAdmissionSection($event) {
        const sectionId = $event.itemData.id;
        const section = this.patienDataModelService
            .getPatientAdmissionSectionById(sectionId, this.currentPatientAdmissionModel.patientRoot);

        if (!section)
            throw StringHelper.format("Section with id: {0} was not found", sectionId);

        this.onPatientAdmissionSectionSelected(section);
    }

    savePatientAdmission(): Promise<any> {
        this.currentPatientAdmission.AdmissionData = JSON.stringify(this.currentPatientAdmissionModel);
        return this.dataService.update(TableNames.admission, this.currentPatientAdmission.Id, { AdmissionData: this.currentPatientAdmission.AdmissionData })
            .then(() => {
                this.toastService.showSuccessMessage("Appointment successfully updated", 1500);
                return true;
            })
            .catch((error) => error)
    }

    makeReport(): void {
        this.isReportPopupOpened = true;
    }

    private proceedSignedOff(): void {
        this.signatureInfoAppService.isAdmissionSignedOff(this.currentPatientAdmission.Id)
            .then(isAdmissionSignedOff => {
                this.isSignedOff = isAdmissionSignedOff;
            });
    }

    private onPatientAdmissionSectionSelected(selectedSection: any): void {
        const admissionModel = this.currentPatientAdmissionModel && this.currentPatientAdmissionModel.patientRoot;
        const admissionId = this.currentPatientAdmission.Id;

        this.patientAdmissionSectionModel =
            new PatientAdmissionSectionModel(admissionModel, selectedSection,
                this.patientId, admissionId, this.isSignedOff, this.appointmentId);

        this.currentlyOpenedSection = selectedSection;
    }

    private setPatientChartHeaderData(): void {
        const admission = this.currentPatientAdmission;

        const admissionId = admission.Id;
        const dateOfService = this.appointmentStartDate;
        const patientId = admission.PatientDemographicId;

        this.patientChartHeaderData =
            new PatientChartHeaderData(patientId, admissionId, dateOfService);
    }

    private adjustTreeViewHeight(): void {
        this.treeView.height =
            0.65 * this.wionowService.windowRef.innerHeight;
    }
}