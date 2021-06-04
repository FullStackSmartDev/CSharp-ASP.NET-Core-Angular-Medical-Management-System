import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { Assessment } from 'src/app/patientChart/models/assessment';
import { AlertService } from 'src/app/_services/alert.service';
import { PatientChartTrackService } from 'src/app/_services/patient-chart-track.service';
import { IcdCodeService } from 'src/app/_services/icd-code.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

@Component({
    templateUrl: 'assessment.component.html',
    selector: 'assessment'
})

export class AssessmentComponent implements OnInit {
    @ViewChild("assessmentsGrid", { static: false }) assessmentsGrid: DxDataGridComponent;
    @ViewChild("assessmentForm", { static: false }) assessmentForm: DxFormComponent;

    @Input() patientChartNode: PatientChartNode;
    @Input() patientChartDocumentNode: PatientChartNode;

    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    private _orderService: OrderService;
    private _assessmentCurrentOrderNumber: number;

    isNewAssessment: boolean = true;

    orderNumberMaxAvailableValue: number;
    orderNumberMinAvailableValue: number;

    availableOrderNumbers: Array<number> = [];
    selectedAssessments: Array<any> = [];

    assessments: Array<any> = [];
    assessment: any;

    icdCodesDataSource: any = {};
    phrasesDataSource: any = {};

    isAssessmentPopupOpened: boolean = false;

    constructor(private alertService: AlertService,
        private patientChartTrackService: PatientChartTrackService,
        private icdCodeService: IcdCodeService,
        private dxDataUrlService: DxDataUrlService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    ngOnInit() {
        this.init();
        if (this.patientChartNode)
            this.assessments = this.patientChartNode.value;

        this._orderService = new OrderService(this.assessments);
        this.assessment = new Assessment();
    }

    onKeyPressInOrderNumberBox($event) {
        const event = $event.event;
        const keyCode = event.keyCode;
        //order number text box supports only integer value,
        // this check prevent of entering dot symbol
        if (keyCode === 46 || keyCode === 44)
            event.preventDefault();
    }

    onPhraseSuggestionApplied($event) {
        this.assessment.notes = $event;
    }

    onAssessmentFieldChanged($event): void {
        const dataField = $event.dataField;
        const fieldValue = $event.value;

        if (dataField === "icdCode" && fieldValue) {
            this.icdCodeService.getById(fieldValue)
                .then(icdCode => {
                    this.assessment.diagnosis = icdCode.name;
                    this.assessment.icdCode = "";
                })
                .catch(error => this.alertService.error(error.message ? error.message : error));
        }
    }

    onAssessmentPopupHidden() {
        this.assessment = new Assessment();
        this.selectedAssessments = [];
        this.isNewAssessment = true;
    }

    openAssessmentForm() {
        this._assessmentCurrentOrderNumber = this._orderService.maxOrderNumber

        if (this.isNewAssessment) {
            this.assessment.order = this._orderService.maxOrderNumber;
        }

        this.setMinMaxOrderNumberRange();

        this.isAssessmentPopupOpened = true;
    }

    deleteAssessment(assessment, $event) {
        $event.stopPropagation();
        const assessmentId = assessment.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the assessment ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this._orderService.adjustOrder(assessmentId, assessment.order, true);
                this.assessmentsGrid.instance.refresh();
                this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.AssessmentNode);
            }
        });
    }

    onAssessmentSelected($event) {
        if (this.isSignedOff) {
            this.selectedAssessments = [];
            return;
        }

        const selectedAssessment = $event.selectedRowsData[0];
        if (!selectedAssessment) {
            return;
        }

        this.isNewAssessment = false;

        this.setMinMaxOrderNumberRange();

        this.assessment = JSON.parse(JSON.stringify(selectedAssessment));

        this._assessmentCurrentOrderNumber = this.assessment.order;

        this.isAssessmentPopupOpened = true;
    }

    createUpdateAssessment() {
        const validationResult = this.assessmentForm.instance.validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewAssessment) {
            this.assessments.push(this.assessment);
        }

        else {
            const assessmentToUpdate = this.assessments.filter(a => a.id === this.assessment.id)[0];

            assessmentToUpdate.diagnosis = this.assessment.diagnosis;
            assessmentToUpdate.notes = this.assessment.notes;
            assessmentToUpdate.order = this.assessment.order;
        }

        this._orderService.adjustOrder(this.assessment.id, this._assessmentCurrentOrderNumber);

        this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.AssessmentNode);

        this.isAssessmentPopupOpened = false;
        this.selectedAssessments = [];
        this.assessmentsGrid.instance.refresh();
    }

    private setMinMaxOrderNumberRange() {
        this.orderNumberMinAvailableValue = 1;
        this.orderNumberMaxAvailableValue = this.isNewAssessment ?
            this._orderService.maxOrderNumber
            : this._orderService.maxOrderNumber - 1;
    }

    private init() {
        this.initIcdCodeDataSource();
    }

    private initIcdCodeDataSource(): void {
        this.icdCodesDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("icdcode"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }
}

class OrderService {
    private _items;

    constructor(items: Array<any>) {
        this._items = items;
    }

    get maxOrderNumber(): number {
        return this._items.length + 1;
    }

    adjustOrder(changedItemId: string, previousOrderNumber: number, isDelete: boolean = false) {
        const changedItem = this._items.filter(i => i.id === changedItemId)[0];
        if (!changedItem) {
            throw `Item with id: ${changedItemId} was not found`;
        }

        if (isDelete) {
            const changedItemIndex = this._items.map(i => i.order).indexOf(changedItem.order);

            this._items.splice(changedItemIndex, 1);

            for (let i = changedItemIndex; i < this._items.length; i++) {
                this._items[i].order = this._items[i].order - 1;
            }
        }
        const isOrderChanged = changedItem.order !== previousOrderNumber;

        if (isOrderChanged) {
            const itemToModify = this._items.filter(i => i.order === changedItem.order && i.id !== changedItemId)[0];
            if (!itemToModify) {
                throw "Item was not found";
            }
            else {
                itemToModify.order = previousOrderNumber;
            }
        }

        this._items.sort((item1, item2) => item1.order - item2.order);
    }
}