import { Component, Input, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { DxFormComponent, DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { LoadPanelService } from '../../provider/loadPanelService';
import { GuidHelper } from '../../helpers/guidHelper';
import { IcdCodeReadDataService } from '../../provider/dataServices/read/IcdCodeReadDataService';
import { ApplicationConfigurationService } from '../../provider/applicationConfigurationService';
import { IcdCode } from '../../dataModels/icdCode';
import CustomStore from 'devextreme/data/custom_store';
import { ControlDefaultValues } from '../../constants/controlDefaultValues';
import { CommonConstants } from '../../constants/commonConstants';
import { AlertService } from '../../provider/alertService';
import { KeywordDataService } from '../../provider/dataServices/readCreateUpdate/keywordDataService';
import { AppointmentAllegationsParser } from '../../provider/appointmentAllegationsParser';

@Component({
    templateUrl: 'appointmentAllegationsComponent.html',
    selector: 'appointment-allegations'
})
export class AppointmentAllegationsComponent implements AfterViewInit, OnInit {
    @Input("appointmentData") appointmentData: any;

    @ViewChild("allegationCreationForm") allegationCreationForm: DxFormComponent;
    @ViewChild("allegationDataGrid") allegationDataGrid: DxDataGridComponent;
    @ViewChild("createUpdateAllegationPopup") createUpdateAllegationPopup: DxPopupComponent;

    applicationConfiguration: any = {};

    selectedAllegations: Array<any> = [];
    allegations: AppointmentAllegation[] = [];
    allegation: AppointmentAllegation = new AppointmentAllegation();
    isNewAllegation: boolean = true;

    icdCodesDataSource: any = {};

    isCreateUpdatePopupOpened: boolean = false;

    constructor(private loadPanelService: LoadPanelService,
        private icdCodeReadDataService: IcdCodeReadDataService,
        private alertService: AlertService,
        private keywordDataService: KeywordDataService) {
        this.applicationConfiguration = ApplicationConfigurationService;

        this.onKeywordValueChanged = this.onKeywordValueChanged.bind(this);
    }

    onKeywordValueChanged() {
        this.allegationCreationForm.instance.getEditor("CodeId")
            .getDataSource()
            .reload()
    }

    ngAfterViewInit(): void {
        this.createUpdateAllegationPopup
            .instance
            .registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            });
    }

    ngOnInit(): void {
        this.setAllegations();
        this.initIcdCodeDataSource();
    }

    openCreateAllegationForm() {
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateAllegationForm();
    }

    createUpdateAllegation() {
        const validationResult = this.allegationCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewAllegation) {
            this.saveNewAllegation();
        }
        else {
            this.updateAllegation();
        }
    }

    onAllegationSelected($event) {
        const selectedAllegation = $event.selectedRowsData[0];

        if (!selectedAllegation)
            return;

        this.allegation = new AppointmentAllegation(selectedAllegation.Id,
            selectedAllegation.Keyword, selectedAllegation.CodeId,
            selectedAllegation.CodeName, selectedAllegation.CodeDescription);

        this.isNewAllegation = false;
        this.isCreateUpdatePopupOpened = true;
    }

    deleteAllegation(allegation: any, $event: any) {
        $event.stopPropagation();
        this.alertService.confirm("Are you sure you want to delete allegation ?", "Confirm deletion")
            .then(deleteConfirmation => {
                if (deleteConfirmation) {
                    const allegationId = allegation.Id;
                    const allegationIds = this.allegations.map(a => a.Id);

                    const allegationIndexToDelete = allegationIds.indexOf(allegationId);
                    this.allegations.splice(allegationIndexToDelete, 1);

                    this.allegationDataGrid.instance.refresh();

                    const allegationsJsonStr = AppointmentAllegationsParser
                        .stringify(this.allegations);

                    this.appointmentData.Allegations = allegationsJsonStr;
                }
            });
    }

    setAllegations() {
        const allegationsStr = this.appointmentData.Allegations;

        this.allegations = allegationsStr
            ? AppointmentAllegationsParser.parse(allegationsStr)
            : [];
    }

    private resetCreateUpdateAllegationForm() {
        this.isNewAllegation = true;
        this.allegation = new AppointmentAllegation();
        this.selectedAllegations = [];
    }

    private initIcdCodeDataSource(): void {
        this.icdCodesDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key) {
                    return Promise.resolve();
                }

                if (key === CommonConstants.emptyGuid) {
                    return Promise.resolve(this.emptyIcdCode);
                }

                return this.icdCodeReadDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const keyword = this.allegation.Keyword;
                const emptCode = this.emptyIcdCode;
                if (!keyword) {
                    return [emptCode];
                }
                return this.keywordDataService.save(keyword)
                    .then(() => {
                        return this.icdCodeReadDataService.getByKeyword(keyword)
                            .then(icdCodes => {
                                icdCodes.push(this.emptyIcdCode);
                                return icdCodes;
                            })
                            .catch(error => this.alertService.error(error.message ? error.message : error));
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));
            }
        });
    }

    private get emptyIcdCode(): IcdCode {
        const icdCode = new IcdCode(CommonConstants.emptyGuid);
        icdCode.Name = ControlDefaultValues.selectBox;
        return icdCode;
    }

    private updateAllegation(): void {
        const allegationId = this.allegation.Id;

        const oldAllegation = this.allegations
            .filter((a) => a.Id === allegationId)[0];

        if (this.allegation.CodeId === CommonConstants.emptyGuid) {

            oldAllegation.CodeId = CommonConstants.emptyGuid;
            oldAllegation.Keyword = this.allegation.Keyword;
            oldAllegation.CodeName = ControlDefaultValues.selectBox;
            oldAllegation.CodeDescription = ControlDefaultValues.selectBox;

            this.executePostSavingActions();
            this.isCreateUpdatePopupOpened = false;
        }
        else {
            this.loadPanelService.showLoader();
            this.icdCodeReadDataService.getById(this.allegation.CodeId)
                .then(icdCode => {
                    oldAllegation.Keyword = this.allegation.Keyword;
                    oldAllegation.CodeName = icdCode.Code;
                    oldAllegation.CodeDescription = icdCode.Name;
                    oldAllegation.CodeId = icdCode.Id;

                    this.executePostSavingActions();

                    this.loadPanelService.hideLoader();
                    this.isCreateUpdatePopupOpened = false;

                })
                .catch(error => {
                    this.loadPanelService.hideLoader();
                    this.alertService.error(error.message ? error.message : error);
                })
        }

    }

    private saveNewAllegation(): void {
        const icdCodeId = this.allegation.CodeId;

        if (!icdCodeId) {
            this.allegation.CodeId = CommonConstants.emptyGuid;
        }

        if (this.allegation.CodeId === CommonConstants.emptyGuid) {

            this.allegation.CodeDescription = ControlDefaultValues.selectBox;
            this.allegation.CodeName = ControlDefaultValues.selectBox;

            this.allegations.push(this.allegation);
            this.executePostSavingActions();
            this.isCreateUpdatePopupOpened = false;
        }
        else {
            this.loadPanelService.showLoader();
            this.icdCodeReadDataService.getById(this.allegation.CodeId)
                .then(icdCode => {
                    this.allegation.CodeDescription = icdCode.Name;
                    this.allegation.CodeName = icdCode.Code;

                    this.allegations.push(this.allegation);
                    this.executePostSavingActions();

                    this.loadPanelService.hideLoader();
                    this.isCreateUpdatePopupOpened = false;

                })
                .catch(error => {
                    this.loadPanelService.hideLoader();
                    this.alertService.error(error.message ? error.message : error);
                })
        }

    }

    private executePostSavingActions(): void {
        this.resetCreateUpdateAllegationForm();

        this.allegationDataGrid.instance.refresh();

        const allegationsJsonStr = AppointmentAllegationsParser
            .stringify(this.allegations);

        this.appointmentData.Allegations = allegationsJsonStr;
    }
}

export class AppointmentAllegation {
    Id: string;
    CodeName: string;
    CodeDescription: string;
    CodeId: string;
    Keyword: string;

    constructor(id: string = "", keyword: string = "", codeId: string = "",
        codeName: string = "", codeDescription: string = "") {
        this.Id = id ? id : GuidHelper.generateNewGuid();
        this.CodeName = codeName;
        this.CodeId = codeId;
        this.Keyword = keyword;
        this.CodeDescription = codeDescription;
    }
}