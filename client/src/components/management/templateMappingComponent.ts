import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../provider/dataService';
import CustomStore from 'devextreme/data/custom_store';
import { TableNames } from '../../constants/tableNames';
import { BaseComponent } from '../baseComponent';
import { SearchFilter } from '../../classes/searchFilter';
import { ToastService } from '../../provider/toastService';
import { DxDataGridComponent, DxValidatorComponent } from 'devextreme-angular';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { StringHelper } from '../../helpers/stringHelper';
import { TemplateType } from '../../constants/templateType';

@Component({
    templateUrl: 'templateMappingComponent.html',
    selector: 'template-mapping-component'
})

export class TemplateMappingComponent extends BaseComponent implements OnInit, OnDestroy {
    _separator: string = " ; ";

    keyword: string = "";
    keywords: Array<string> = [];

    rosTemplateDataSource: any = {};
    selectedRosTemplate: any = {};
    selectedRosTemplateId: string = "";

    hpiTemplateDataSource: any = {};
    selectedHpiTemplate: any = {};
    selectedHpiTemplateId: string = "";

    physicalExamTemplateDataSource: any = {};
    selectedPhysicalExamTemplate: any = {};
    selectedPhysicalExamTemplateId: string = "";

    rosTemplates: Array<any> = [];
    hpiTemplates: Array<any> = [];
    physicalExamTemplates: Array<any> = [];

    isChiefComplaintUpdateFormVisible: boolean = false;

    allowTemplateDeleting: boolean = true;
    templateDeleteType: string = "toggle";

    @ViewChild("chiefComplaintDataGrid") chiefComplaintDataGrid: DxDataGridComponent;
    @ViewChild("chiefComplaintTitleValidator") chiefComplaintTitleValidator: DxValidatorComponent;

    selectedChiefComplaints: Array<any> = [];

    chiefComplaint: any = {
        IsDelete: false
    };

    includeDeletedItems: boolean = false;
    isCreateUpdatePopupOpened: boolean = false;

    chiefComplaintDataSource: any = {};

    constructor(dataService: DataService, toastService: ToastService) {
        super(dataService, toastService);
        this.init()
    }

    addNewKeyword() {
        if (this.keyword) {
            const isKeywordExists = !!this.keywords.filter(k => k === this.keyword)[0];
            if (isKeywordExists) {
                return;
            }

            this.keywords.push(this.keyword);
            this.keyword = "";
        }
    }

    titleChanged($event) {
        const chiefComplaintTitle = $event.value;
        if (!chiefComplaintTitle) {
            this.chiefComplaint.Name = "";
            return;
        }
        if (chiefComplaintTitle && !this.isNewChiefComplaint)
            return;
        this.chiefComplaint.Name = StringHelper.camelize(chiefComplaintTitle);
    }

    onCreateUpdatePopupHidden() {
        this.resetChiefComplaint();
    }

    includeDeletedItemsCheckboxChanged($event) {
        this.includeDeletedItems = $event.value;
        this.chiefComplaintDataGrid.instance.refresh();
    }

    openChiefComplaintCreationForm($event) {
        $event.preventDefault();
        this.isCreateUpdatePopupOpened = true;
    }

    onHpiTemplateChanged($event) {
        const self = this;
        this.dataService.getChiefComplaintTemplateById($event.value)
            .then(template => {
                if (template)
                    self.selectedHpiTemplate = template;
            })
    }

    addNewHpiTemplate() {
        if (this.selectedHpiTemplateId) {
            this.hpiTemplates.push(this.selectedHpiTemplate);
            this.selectedHpiTemplate = {};
            this.selectedHpiTemplateId = "";
        }
    }

    onPhysicalExamTemplateChanged($event) {
        const self = this;
        this.dataService.getChiefComplaintTemplateById($event.value)
            .then(template => {
                if (template)
                    self.selectedPhysicalExamTemplate = template;
            })
    }

    onRosTemplateChanged($event) {
        const self = this;
        this.dataService.getChiefComplaintTemplateById($event.value)
            .then(template => {
                if (template)
                    self.selectedRosTemplate = template;
            })
    }

    addNewRosTemplate() {
        if (this.selectedRosTemplateId) {
            this.rosTemplates.push(this.selectedRosTemplate);
            this.selectedRosTemplate = {};
            this.selectedRosTemplateId = "";
        }
    }

    addNewPhysicalExamTemplate() {
        if (this.selectedPhysicalExamTemplateId) {
            this.physicalExamTemplates.push(this.selectedPhysicalExamTemplate);
            this.selectedPhysicalExamTemplate = {};
            this.selectedPhysicalExamTemplateId = "";
        }
    }

    createUpdateChiefComplaint($event) {
        $event.preventDefault();
        const isNewChiefComplaint = this.isNewChiefComplaint;
        const self = this;
        if (!isNewChiefComplaint) {
            const chiefComplaintId = this.chiefComplaint.Id;

            self.dataService
                .update(TableNames.chiefComplaint, chiefComplaintId, this.chiefComplaint)
                .then(() => {
                    return self.getTemplatesAndKeywordsCreationPromise(chiefComplaintId);
                })
                .then(() => {
                    self.chiefComplaintDataGrid.instance.refresh();
                    self.resetChiefComplaint();
                })
                .catch(error => self
                    .toastService.showErrorMessage(self.getErrorMessage(error)));
        }
        else {
            this.dataService.create(TableNames.chiefComplaint, this.chiefComplaint, true)
                .then((chiefComplaintId) => {
                    return self.getTemplatesAndKeywordsCreationPromise(chiefComplaintId);
                })
                .then(() => {
                    self.chiefComplaintDataGrid.instance.refresh();
                    self.resetChiefComplaint();
                })
                .catch(error => self.toastService.showErrorMessage(self.getErrorMessage(error)));
        }

    }

    private getTemplatesAndKeywordsCreationPromise(chiefComplaintId: string) {
        const newChiefComplaintTemplateIds = this.hpiTemplates
            .concat(this.rosTemplates)
            .concat(this.physicalExamTemplates)
            .map(t => t.TemplateId);
            
        const createChiefComplaintTemplatesPromise = 
            this.dataService.updateChiefComplaintTemplates(chiefComplaintId, newChiefComplaintTemplateIds);

        const createChiefComplaintKeywordsPromise =
            this.dataService.updateChiefComplaintKeywords(chiefComplaintId, this.keywords);

        return Promise.all([createChiefComplaintTemplatesPromise, createChiefComplaintKeywordsPromise])
    }

    onChiefComplaintSelected($event) {
        const selectedChiefComplaint = $event.selectedRowsData[0];
        if (!selectedChiefComplaint)
            return;
        const selectedChiefComplaintId = selectedChiefComplaint.Id;

        this.chiefComplaint = {
            Name: selectedChiefComplaint.Name,
            Id: selectedChiefComplaint.Id,
            IsDelete: selectedChiefComplaint.IsDelete,
            Title: selectedChiefComplaint.Title,
        }
        const self = this;

        const chiefComplaintTemplatesQueryPromise = this.dataService
            .getChiefComplaintTemplates(selectedChiefComplaintId);

        const chiefComplaintKeywordsQueryPromise = this.dataService
            .getChiefComplaintsKeywords([selectedChiefComplaintId]);

        Promise.all([chiefComplaintTemplatesQueryPromise, chiefComplaintKeywordsQueryPromise])
            .then(chiefComplaintTemplatesAndKeywords => {
                const templates = chiefComplaintTemplatesAndKeywords[0];
                const keywords = chiefComplaintTemplatesAndKeywords[1];

                if (templates && templates.length) {
                    self.rosTemplates = templates.filter(t => t.Type === TemplateType.ros);
                    self.hpiTemplates = templates.filter(t => t.Type === TemplateType.hpi);
                    self.physicalExamTemplates = templates.filter(t => t.Type === TemplateType.pe);
                }

                if (keywords && keywords.length) {
                    self.keywords = keywords.map(k => k.Value);
                }

                self.isCreateUpdatePopupOpened = true;
            })
            .catch(error => self.toastService.showErrorMessage(self.getErrorMessage(error)));
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    // #region private methods

    private get isNewChiefComplaint(): boolean {
        return !this.chiefComplaint.Id;
    }

    private resetChiefComplaintCreationForm(): any {
        this.chiefComplaintTitleValidator.instance.reset();
    }

    private init(): any {
        this.initChiefComplaintDataSource();
        this.initRosTemplateDataSource();
        this.initHpiTemplateDataSource();
        this.initPhysicalExamTemplateDataSource();
    }

    private initChiefComplaintDataSource(): any {
        const self = this;
        this.chiefComplaintDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.dataService.getById(TableNames.chiefComplaint, key);
            },
            load: (loadOptions: any) => {
                if (!loadOptions.searchValue) {
                    loadOptions.searchValue = self.searchText;
                }
                const searchFilter = SearchFilter.createFromDataSourceLoadOptions(loadOptions, self.includeDeletedItems);
                return this.dataService.getChiefComplaintsWithTemplatesAndKeywords(searchFilter)
                    .then(chiefComplaintsResult => {
                        chiefComplaintsResult.data = self.adjustChiefComplaintsResult(chiefComplaintsResult);
                        return chiefComplaintsResult;
                    })
                    .catch(error => {
                        self.toastService.showErrorMessage(self.getErrorMessage(error));
                    });
            }
        });
    }

    private adjustChiefComplaintsResult(chiefComplaintsResult: any): any {
        const self = this;

        const chiefComplaintIdPropName = "ChiefComplaintId";
        const templates = chiefComplaintsResult.data.templates;
        const keywords = chiefComplaintsResult.data.keywords;

        const templatesGroupedByChiefComplaint = !templates || !templates.length
            ? null
            : ArrayHelper.groupBy(templates, chiefComplaintIdPropName);

        const keywordsGroupedByChiefComplaint = !keywords || !keywords.length
            ? null
            : ArrayHelper.groupBy(keywords, chiefComplaintIdPropName);

        return chiefComplaintsResult.data.chiefComplaints.map(cc => {
            const chiefComplaintId = cc.Id;
            let chiefComplaintKeywords = !keywordsGroupedByChiefComplaint
                ? []
                : keywordsGroupedByChiefComplaint[chiefComplaintId];

            let chiefComplaintTemplates = !templatesGroupedByChiefComplaint
                ? []
                : templatesGroupedByChiefComplaint[chiefComplaintId];
            if (!chiefComplaintKeywords) {
                chiefComplaintKeywords = [];
            }
            if (!chiefComplaintTemplates) {
                chiefComplaintTemplates = [];
            }
            return {
                Id: chiefComplaintId,
                IsDelete: cc.IsDelete,
                Title: cc.Title,
                Name: cc.Name,
                Keywords: self.getChiefComplaintKeywords(chiefComplaintKeywords),
                HpiTemplates: self.getTemplatesByType(chiefComplaintTemplates, TemplateType.hpi),
                RosTemplates: self.getTemplatesByType(chiefComplaintTemplates, TemplateType.ros),
                PhysicalExamTemplates: self.getTemplatesByType(chiefComplaintTemplates, TemplateType.pe)
            };
        })
    }

    private getTemplatesByType(templates: Array<any>, templateType: string): string {
        return templates
            .filter(t => t.TemplateType === templateType)
            .map(t => t.ReportTitle)
            .join(this._separator);
    }

    private getChiefComplaintKeywords(keywords: Array<any>): any {
        return keywords.map(k => k.Value)
            .join(this._separator);
    }

    private initRosTemplateDataSource(): any {
        this.rosTemplateDataSource.store = this.getTemplateDataSource(TemplateType.ros);
    }

    private initPhysicalExamTemplateDataSource(): any {
        this.physicalExamTemplateDataSource.store = this.getTemplateDataSource(TemplateType.pe);
    }

    private initHpiTemplateDataSource(): any {
        this.hpiTemplateDataSource = this.getTemplateDataSource(TemplateType.hpi);
    }

    private getTemplateDataSource(templateTypeName: string) {
        const self = this;
        return new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return self.dataService.getById(TableNames.template, key);
            },
            load: (loadOptions: any) => {
                const searchString = loadOptions.searchValue;
                let excludedTemplateIds = [];
                switch (templateTypeName) {
                    case TemplateType.hpi:
                        excludedTemplateIds = self.hpiTemplates.map(t => t.TemplateId);
                        break;
                    case TemplateType.ros:
                        excludedTemplateIds = self.rosTemplates.map(t => t.TemplateId);
                        break;
                    case TemplateType.pe:
                        excludedTemplateIds = self.physicalExamTemplates.map(t => t.TemplateId);
                }
                return self.dataService.getTemplatesByType(searchString, templateTypeName, excludedTemplateIds);
            }
        });
    }

    private resetChiefComplaint(): any {
        this.selectedRosTemplate = {};
        this.selectedRosTemplateId = "";
        this.selectedHpiTemplate = {};
        this.selectedHpiTemplateId = "";

        this.selectedPhysicalExamTemplate = {};
        this.selectedPhysicalExamTemplateId = "";

        this.rosTemplates = [];
        this.hpiTemplates = [];
        this.physicalExamTemplates = [];

        this.keyword = "";
        this.keywords = [];

        this.chiefComplaint = {
            IsDelete: false
        };

        this.selectedChiefComplaints = [];
        this.resetChiefComplaintCreationForm();
        this.isCreateUpdatePopupOpened = false;
    }

    // #endregion
}