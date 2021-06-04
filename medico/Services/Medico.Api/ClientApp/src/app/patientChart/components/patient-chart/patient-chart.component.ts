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
import { PatientChartTrackService } from '../../../_services/patient-chart-track.service';
import { AdmissionService } from '../../services/admission.service';
import { SignatureInfo } from '../../models/signatureInfo';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DocumentService } from '../../patient-chart-tree/services/document.service';
import { PatientChartInfo } from '../../models/patientChartInfo';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeManagementService } from '../../services/patient-chart-node-management.service';
import { WindowService } from 'src/app/_services/window.service';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import notify from 'devextreme/ui/notify';

@Component({
    selector: 'patient-chart',
    templateUrl: './patient-chart.component.html',
    styleUrls: ['patient-chart.component.sass']
})
export class PatientChartComponent implements OnInit, OnDestroy {
    @ViewChild("treeView", { static: false }) treeView: DxTreeViewComponent;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    isAdmissionSignedOff: boolean;

    appointment: Appointment;
    admission: Admission;

    routeParamsSubscription: Subscription;
    patientChartChangesSubscription: Subscription;

    patientChartProjectionTree: any[];

    patientChartRootNode: PatientChartNode;
    selectedPatientChartNode: PatientChartNode;
    patientChartInfo: PatientChartInfo;

    patientChartHeaderData: PatientChartHeaderData;

    isReportPopupOpened: boolean = false;

    selectedNodeId: string = "";

    constructor(private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private alertService: AlertService,
        private patienChartService: PatientChartService,
        private signatureInfoService: SignatureInfoService,
        private patientChartTrackService: PatientChartTrackService,
        private admissionService: AdmissionService,
        private documentService: DocumentService,
        private router: Router,
        private companyIdService: CompanyIdService,
        private patientChartNodeManagementService: PatientChartNodeManagementService,
        private windowService: WindowService) { }

    signOff(): void {
        const signatureInfo = new SignatureInfo();
        const currentDate: any = new Date();

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
                            .getPatientChartTreeProjection(this.patientChartRootNode, true)];

                        if (this.selectedPatientChartNode) {
                            const patientChartDocumentNode =
                                this.patientChartNodeManagementService
                                    .getDocumentNodeRelatedToInnerNode(this.patientChartRootNode, this.selectedPatientChartNode.id);

                            this.onPatientChartNodeSelected(this.selectedPatientChartNode, patientChartDocumentNode)
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

    makeReport() {
        this.isReportPopupOpened = true;
    }

    onReportPopupHidden() {
        this.isReportPopupOpened = false;
    }

    selectPatientChartNode($event): void {
        $event.itemData.selected = true;

        const nodeId = $event.itemData.id;

        this.selectedNodeId = nodeId;

        const selectedPatientChartNode =
            this.patientChartNodeManagementService
                .getById(nodeId, this.patientChartRootNode);

        const patientChartDocumentNode =
            this.patientChartNodeManagementService
                .getDocumentNodeRelatedToInnerNode(this.patientChartRootNode, selectedPatientChartNode.id)

        if (!selectedPatientChartNode)
            throw `Patient chart node with id: ${nodeId} was not found`;

        this.onPatientChartNodeSelected(selectedPatientChartNode, patientChartDocumentNode);
        this.moveToTopIfScrollExists();
    }

    savePatientAdmission(): Promise<any> {
        this.admission.admissionData = JSON.stringify(this.patientChartRootNode);
        return this.admissionService.save(this.admission);
    }

    isNodeOpened(nodeId: string): boolean {
        return nodeId === this.selectedNodeId;
    }

    private moveToTopIfScrollExists() {
        const window = this.windowService.windowRef;
        const isVerticalExists = !!window.pageYOffset;

        if (isVerticalExists)
            window.scrollTo(0, 0);
    }

    private onPatientChartNodeSelected(selectedChartNode: PatientChartNode, patientChartDocumentNode: PatientChartNode): void {
        const admissionId = this.admission.id;

        this.patientChartInfo =
            new PatientChartInfo(patientChartDocumentNode, selectedChartNode,
                this.admission.patientId, admissionId, this.isAdmissionSignedOff,
                this.admission.appointmentId, this.companyId);

        this.selectedPatientChartNode = selectedChartNode;
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
                .subscribe((patientChartNodeType) => {
                    this.savePatientAdmission()
                        .then(() => {
                            let patientChartTreeSnapshot = this.patientChartProjectionTree

                            if (patientChartNodeType === PatientChartNodeType.ScanDocumentNode) {
                                this.documentService.getByPatientId(this.appointment.patientId).then(
                                    patientScanDocumentsInfo => {
                                        this.patienChartService
                                            .addScanDocumentsToPatientChartNodes(this.patientChartRootNode, patientScanDocumentsInfo);

                                        this.updatePatientChartTreeView(patientChartTreeSnapshot);
                                    }
                                );
                            }

                            this.updatePatientChartTreeView(patientChartTreeSnapshot);

                            const patientChartHeaderUpdateNeeded = patientChartNodeType === PatientChartNodeType.AllergiesNode ||
                                patientChartNodeType === PatientChartNodeType.VitalSignsNode;

                            if (patientChartHeaderUpdateNeeded)
                                this.setPatientChartHeaderData();

                            notify("Patient chart was successfully saved", "info", 800);
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
                                this.patientChartRootNode = JSON.parse(admission.admissionData);

                                if (!appointment.admissionId) {
                                    appointment.admissionId = admission.id;
                                    this.appointmentService.save(appointment);
                                }

                                this.signatureInfoService.isAdmissionSignedOff(admission.id)
                                    .then(isAdmissionSignedOff => {
                                        this.isAdmissionSignedOff = isAdmissionSignedOff;

                                        this.documentService.getByPatientId(this.appointment.patientId).then(
                                            patientScanDocumentsInfo => {
                                                this.patienChartService.addScanDocumentsToPatientChartNodes(this.patientChartRootNode, patientScanDocumentsInfo);

                                                this.patientChartProjectionTree = [this.patienChartService
                                                    .getPatientChartTreeProjection(this.patientChartRootNode, isAdmissionSignedOff)];

                                                this.setPatientChartHeaderData();
                                            }
                                        );

                                    })
                            });
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));
            });
    }

    private updatePatientChartTreeView(patientChartTreeSnapshot: any) {
        this.patientChartProjectionTree = [this.patienChartService
            .getPatientChartTreeProjection(this.patientChartRootNode, this.isAdmissionSignedOff)];

        this.restoreTreeState(this.patientChartProjectionTree, patientChartTreeSnapshot);
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