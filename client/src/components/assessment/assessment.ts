import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../provider/toastService';
import { DxDataGridComponent, DxValidationGroupComponent, DxLookupComponent } from 'devextreme-angular';
import { PatientDataModelTrackService } from '../../provider/patientDataModelTrackService';
import { StringHelper } from '../../helpers/stringHelper';
import { BaseHistoryComponent } from '../patientHistory/baseHistoryComponent';
import { AlertService } from '../../provider/alertService';
import { LoadPanelService } from '../../provider/loadPanelService';
import { Assessment } from '../../dataModels/assessment';
import { DefaultValuesProvider } from '../../provider/defaultValuesProvider';
import { LookupItemsAppService } from '../../provider/appServices/lookupItemsAppService';
import { LookupDataSourceProvider } from '../../provider/lookupDataSourceProvider';
import { IcdCodeReadDataService } from '../../provider/dataServices/read/IcdCodeReadDataService';

@Component({
    templateUrl: 'assessment.html',
    selector: 'assessment'
})

export class AssessmentComponent extends BaseHistoryComponent implements OnInit {
    @ViewChild("assessmentsGrid") assessmentsGrid: DxDataGridComponent;
    @ViewChild("assessmentValidationGroup") assessmentValidationGroup: DxValidationGroupComponent;
    @ViewChild("icdCodeLookup") icdCodeLookup: DxLookupComponent;

    @Input("patientAdmissionSection") patientAdmissionSection: any;
    @Input("patientAdmission") patientAdmission: any;

    @Input("isSignedOff") isSignedOff: boolean;

    private _orderService: OrderService;
    private _assessmentCurrentOrderNumber: number;

    isNewAssessment: boolean = true;

    orderNumberMaxAvailableValue: number;
    orderNumberMinAvailableValue: number;

    availableOrderNumbers: Array<number> = [];
    selectedAssessments: Array<any> = [];

    assessments: Array<any> = [];
    assessment: Assessment;

    icdCodeDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(private icdCodeReadDataService: IcdCodeReadDataService,
        alertService: AlertService,
        loadPanelService: LoadPanelService,
        private patientDataModelTrackService: PatientDataModelTrackService,
        toastService: ToastService,
        lookupItemsAppService: LookupItemsAppService,
        defaultValuesProvider: DefaultValuesProvider,
        private lookupDataSourceProvider: LookupDataSourceProvider) {
        super(alertService,
            loadPanelService, toastService, defaultValuesProvider, lookupItemsAppService);

        this.init();
    }

    ngOnInit() {
        if (this.patientAdmissionSection) {
            this.assessments = this.patientAdmissionSection.value;
        }

        this._orderService =
            new OrderService(this.assessments);

        this.assessment = new Assessment();
    }

    get lookupItemNames(): string[] {
        return [];
    }

    onCreateUpdatePopupHidden() {
        this.assessment = new Assessment();
        this.selectedAssessments = [];
        this.resetValidation();
        this.isNewAssessment = true;
    }

    openAssessmentCreationForm($event) {
        $event.preventDefault();

        this._assessmentCurrentOrderNumber =
            this._orderService.maxOrderNumber

        if (this.isNewAssessment) {
            this.assessment.Order =
                this._orderService.maxOrderNumber;
        }

        this.setMinMaxOrderNumberRange();

        this.isCreateUpdatePopupOpened = true;
    }

    diagnosisChanged($event) {
        const icdCodeId = $event.value;
        if (!icdCodeId) {
            return;
        }

        this.icdCodeReadDataService
            .getById(icdCodeId)
            .then(icdCode => {
                this.assessment.Diagnosis = icdCode.Name;
                this.icdCodeLookup.instance.reset();
            });
    }

    onAssessmentSelected($event) {
        if (this.isSignedOff) {
            this.selectedAssessments = [];
            return;
        }

        const selectedAssessment =
            $event.selectedRowsData[0];

        if (!selectedAssessment) {
            return;
        }

        this.isNewAssessment = false;

        this.setMinMaxOrderNumberRange();

        this.assessment = this.assessment
            .createFromEntityModel(selectedAssessment);

        this._assessmentCurrentOrderNumber
            = this.assessment.Order;

        this.isCreateUpdatePopupOpened = true;
    }

    createUpdateAssessment($event) {
        $event.preventDefault();

        if (this.isNewAssessment) {
            this.assessments
                .push(this.assessment);
        }

        else {
            const assessmentToUpdate =
                this.assessments.filter(a => a.Id === this.assessment.Id)[0];

            assessmentToUpdate.Diagnosis =
                this.assessment.Diagnosis;
            assessmentToUpdate.IsDelete =
                this.assessment.IsDelete;
            assessmentToUpdate.Notes =
                this.assessment.Notes;
            assessmentToUpdate.Order =
                this.assessment.Order;
        }

        this._orderService
            .adjustOrder(this.assessment.Id, this._assessmentCurrentOrderNumber,
                this.assessment.IsDelete);

        this.patientDataModelTrackService
            .emitPatientDataModelChanges(true);

        const addedDiagnosis =
            this.assessment.Diagnosis;

        this.isCreateUpdatePopupOpened = false;
        this.selectedAssessments = [];
        this.assessmentsGrid.instance.refresh();

        const successfullyAddedAssessmentMessage = StringHelper.format(`{0} assessment was successfully added.`,
            addedDiagnosis);

        this.toastService
            .showSuccessMessage(successfullyAddedAssessmentMessage);
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

    private initIcdCodeDataSource() {
        this.icdCodeDataSource.store =
            this.lookupDataSourceProvider.icdCodeLookupDataSource;
    }

    private resetValidation() {
        this.assessmentValidationGroup
            .instance.reset();
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

    adjustOrder(changedItemId: string, previousOrderNumber: number, isDelete: boolean) {
        const changedItem = this._items.filter(i => i.Id === changedItemId)[0];
        if (!changedItem) {
            throw `Item with id: ${changedItemId} was not found`;
        }

        if (isDelete) {
            const changedItemIndex = this._items
                .map(i => i.Order).indexOf(changedItem.Order);

            this._items.splice(changedItemIndex, 1);

            for (let i = changedItemIndex; i < this._items.length; i++) {
                this._items[i].Order = this._items[i].Order - 1;
            }
        }
        else {
            const isOrderChanged =
                changedItem.Order !== previousOrderNumber;

            if (isOrderChanged) {
                const itemToModify =
                    this._items
                        .filter(i => i.Order === changedItem.Order && i.Id !== changedItemId)[0];
                if (!itemToModify) {
                    throw "Item was not found";
                }
                else {
                    itemToModify.Order
                        = previousOrderNumber;
                }
            }
        }

        this._items
            .sort((item1, item2) => item1.Order - item2.Order);
    }
}