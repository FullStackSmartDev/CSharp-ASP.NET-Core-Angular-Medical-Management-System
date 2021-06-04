import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs';
import { DxTreeViewComponent } from 'devextreme-angular';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { Appointment } from 'src/app/_models/appointment';
import { AlertService } from 'src/app/_services/alert.service';
import { Admission } from '../../models/admission';
import { PatientChartHeaderData } from '../../models/patientChartHeaderData';
import { PatientChartService } from '../../services/patient-chart.service';
import { SignatureInfoService } from '../../services/signature-info.service';
import { WindowService } from 'src/app/_services/window.service';
import { PatientChartSectionInfo } from '../../models/patientChartSectionInfo';
import { PatientChartTrackService } from '../../../_services/patient-chart-track.service';
import { AdmissionService } from '../../services/admission.service';
import { SignatureInfo } from '../../models/signatureInfo';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DocumentService } from '../../patient-chart-tree/services/document.service';

@Component({
    selector: 'patient-chart',
    templateUrl: './patient-chart.component.html'
})
export class PatientChartComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild("treeView", { static: false }) treeView: DxTreeViewComponent;
    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    isAdmissionSignedOff: boolean;

    appointment: Appointment;
    admission: Admission;

    routeParamsSubscription: Subscription;
    patientChartChangesSubscription: Subscription;

    patientChartProjectionTree: any[];
    patientChartTree: any;
    patientChartSectionInfo: any;

    patientChartHeaderData: PatientChartHeaderData;

    patientChartSection: any;

    isReportPopupOpened: boolean = false;

    value: any[] = [];

    constructor(private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private alertService: AlertService,
        private patienChartService: PatientChartService,
        private signatureInfoService: SignatureInfoService,
        private windowService: WindowService,
        private patientChartTrackService: PatientChartTrackService,
        private admissionService: AdmissionService,
        private documentService: DocumentService,
        private router: Router,
        private companyIdService: CompanyIdService) { }

    signOff(): void {
        const signatureInfo = new SignatureInfo();
        const currentDate = new Date().toString();

        const signDate = DateHelper.jsLocalDateToSqlServerUtc(currentDate);

        signatureInfo.signDate = signDate;
        signatureInfo.admissionId = this.admission.id;

        this.appointmentService.getById(this.admission.appointmentId)
            .then(appointment => {
                signatureInfo.physicianId = appointment.physicianId;
                this.signatureInfoService.save(signatureInfo)
                    .then(() => {
                        this.isAdmissionSignedOff = true;

                        this.patientChartProjectionTree = [this.patienChartService
                            .getPatientChartTreeProjection(this.patientChartTree.patientRoot, true)];

                        if (this.patientChartSection) {
                            this.onPatientChartSectionSelected(this.patientChartSection)
                        }

                        this.alertService.info("Document was signed off successfully");
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));

            }).catch(error => this.alertService.error(error.message ? error.message : error));
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
        this.subscribeToRouteParamsChanges();
        this.subscribeToPatientChartChanges();
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        this.patientChartChangesSubscription.unsubscribe();
        this.companyIdSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.adjustTreeViewHeight();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.adjustTreeViewHeight();
    }

    makeReport() {
        this.isReportPopupOpened = true;
    }

    selectPatientChartSection($event): void {
        $event.itemData.selected = true;

        const sectionId = $event.itemData.id;
        const section = this.patienChartService
            .getPatientChartSectionById(sectionId, this.patientChartTree.patientRoot);

        if (!section)
            throw `Section with id: ${sectionId} was not found`;

        this.onPatientChartSectionSelected(section);
    }

    savePatientAdmission(): Promise<any> {
        this.admission.admissionData = JSON.stringify(this.patientChartTree);
        return this.admissionService.save(this.admission);
    }

    private onPatientChartSectionSelected(selectedSection: any): void {
        const patientChartTree = this.patientChartTree && this.patientChartTree.patientRoot;
        const admissionId = this.admission.id;

        this.patientChartSectionInfo =
            new PatientChartSectionInfo(patientChartTree, selectedSection,
                this.admission.patientId, admissionId, this.isAdmissionSignedOff,
                this.admission.appointmentId, this.companyId);

        this.patientChartSection = selectedSection;
    }

    private adjustTreeViewHeight(): void {
        this.treeView.height =
            0.65 * this.windowService.windowRef.innerHeight;
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    if (this.companyId === GuidHelper.emptyGuid)
                        this.companyId = companyId;
                    else
                        this.router.navigate(["/appointments"]);
                }
            });
    }

    private subscribeToPatientChartChanges(): void {
        this.patientChartChangesSubscription =
            this.patientChartTrackService.patientChartChanged
                .subscribe((isPatientChartChanged) => {
                    if (!isPatientChartChanged)
                        return;

                    this.savePatientAdmission()
                        .then(() => {
                            let patientChartTreeSnapshot = this.patientChartProjectionTree

                            this.documentService.getByPatientId(this.appointment.patientId).then(
                                patientScanDocumentsInfo => {
                                    this.patienChartService.addScanDocumentsToPatientChartTree(this.patientChartTree, patientScanDocumentsInfo);

                                    this.patientChartProjectionTree = [this.patienChartService
                                        .getPatientChartTreeProjection(this.patientChartTree.patientRoot, this.isAdmissionSignedOff)];
                                    this.restoreTreeState(this.patientChartProjectionTree, patientChartTreeSnapshot);
                                    this.setPatientChartHeaderData();
                                }
                            );
                        }).catch(error => this.alertService.error(error.message ? error.message : error));
                });
    }

    private subscribeToRouteParamsChanges(): void {
        this.routeParamsSubscription = this.route.params
            .subscribe(params => {
                const appointmentId = params["appointmentId"];
                this.appointmentService.getById(appointmentId)
                    .then(appointment => {
                        this.appointment = appointment;
                        this.patienChartService.getPatientAdmission(appointment)
                            .then(admission => {
                                this.admission = admission;
                                this.patientChartTree = JSON.parse(admission.admissionData);

                                if (!appointment.admissionId) {
                                    appointment.admissionId = admission.id;
                                    this.appointmentService.save(appointment);
                                }

                                this.signatureInfoService.isAdmissionSignedOff(admission.id)
                                    .then(isAdmissionSignedOff => {
                                        this.isAdmissionSignedOff = isAdmissionSignedOff;

                                        this.documentService.getByPatientId(this.appointment.patientId).then(
                                            patientScanDocumentsInfo => {
                                                this.patienChartService.addScanDocumentsToPatientChartTree(this.patientChartTree, patientScanDocumentsInfo);

                                                this.patientChartProjectionTree = [this.patienChartService
                                                    .getPatientChartTreeProjection(this.patientChartTree.patientRoot, isAdmissionSignedOff)];

                                                this.setPatientChartHeaderData();
                                            }
                                        );

                                    })
                            });
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));
            });
    }

    private restoreTreeState(tree, treeSnapshot) {
        for (let i = 0; i < tree.length; i++) {
            const treeSnapshotItem = treeSnapshot[i];
            tree[i].expanded = treeSnapshotItem
                ? treeSnapshotItem.expanded
                : false;

            const treeItems = tree[i].items;
            if (treeItems && treeItems.length && treeSnapshotItem && treeSnapshotItem.items) {
                this.restoreTreeState(tree[i].items, treeSnapshot[i].items);
            }
        }
    }

    private setPatientChartHeaderData(): void {
        const admissionId = this.admission.id;
        const dateOfService = this.appointment.startDate;
        this.patientChartHeaderData = new PatientChartHeaderData(this.admission.patientId, admissionId, dateOfService);
    }
}
