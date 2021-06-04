import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { TemplateTypeIds } from '../../constants/templateType';
import { EntityNameService } from '../../provider/entityNameService';
import { DxAlertService, AlertInfo } from '../../provider/dxAlertService';
import { ChiefComplaintDataService, ChiefComplaintTemplateDataService, ChiefComplaintRelatedKeywordDataService, ChiefComplaintKeywordDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { ChiefComplaint } from '../../dataModels/chiefComplaint';
import { LoadPanelService } from '../../provider/loadPanelService';
import { ChiefComplaintTemplate } from '../../dataModels/chiefComplaintTemplate';
import { ChiefComplaintRelatedKeyword } from '../../dataModels/chiefComplaintRelatedKeyword';
import { ChiefComplaintKeyword } from '../../dataModels/chiefComplaintKeyword';

@Component({
    templateUrl: 'newChiefComplaintMapping.html',
    selector: 'new-chief-complaint-mapping'
})

export class NewChiefComplaintMapping implements OnInit {
    @Input("allegations") allegations: string;

    @ViewChild("chiefComplaintValidationGroup") chiefComplaintValidationGroup: DxValidationGroupComponent;

    _delimiter: string = ",";

    templateTypeIds: any = TemplateTypeIds;
    templateDeleteType: string = "toggle";
    allowTemplateDeleting: boolean = true;

    hpiTemplates: any[] = [];
    peTemplates: any[] = [];
    rosTemplates: any[] = [];

    keywords: any[] = [];

    chiefComplaint: ChiefComplaint;

    constructor(private entityNameService: EntityNameService,
        private loadPanelService: LoadPanelService,
        private chiefComplaintDataService: ChiefComplaintDataService,
        private alertService: DxAlertService,
        private chiefComplaintTemplateDataService: ChiefComplaintTemplateDataService,
        private chiefComplaintRelatedKeywordDataService: ChiefComplaintRelatedKeywordDataService,
        private chiefComplaintKeywordDataService: ChiefComplaintKeywordDataService) {

        this.init();
    }

    addTemplate($event) {
        const allTemplates = this.hpiTemplates
            .concat(this.peTemplates)
            .concat(this.rosTemplates);

        const isTemplateAlreadyAdded =
            !!allTemplates.filter(template => template.Id === $event.Id)[0];

        if (isTemplateAlreadyAdded) {
            const alertInfo = new AlertInfo(
                true, "The template already added",
                100, 350, "Warning"
            );
            this.alertService.show(alertInfo);
            return;
        }

        const templateTypeId = $event.TemplateTypeId;
        if (templateTypeId === this.templateTypeIds.hpi) {
            this.hpiTemplates.push($event);
        }

        if (templateTypeId === this.templateTypeIds.pe) {
            this.peTemplates.push($event);
        }

        if (templateTypeId === this.templateTypeIds.ros) {
            this.rosTemplates.push($event);
        }
    }

    addKeyword($event) {
        const isKeywordAlreadyExists = this.keywords.indexOf($event) !== -1;
        if (isKeywordAlreadyExists) {
            const alertInfo = new AlertInfo(
                true, "The keyword already added",
                100, 350, "Warning"
            );
            this.alertService.show(alertInfo);
            return;
        }

        this.keywords.push($event);
    }

    ngOnInit(): void {
        this.addKeywordsFromPatientAllegations();
        this.chiefComplaint = new ChiefComplaint();
    }

    createChiefComplaint($event) {
        $event.preventDefault();

        this.loadPanelService
            .showLoader();

        this.saveChiefComplaint()
            .then(chiefComplaint => {
                const saveMappedTemplatesPromise =
                    this.saveMappedTemplates(chiefComplaint.Id);

                const saveMappedKeywordsPromise =
                    this.saveMappedKeywords(chiefComplaint.Id);

                const mappedKeywordsAndTemplatesPromises =
                    saveMappedTemplatesPromise.concat(saveMappedKeywordsPromise);

                return Promise.all(mappedKeywordsAndTemplatesPromises);
            })
            .then(() => {
                this.resetNewChiefComplaintMappingForm();
                this.loadPanelService.hideLoader();
            });
    }

    validateGeneratedName(params) {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.chiefComplaintDataService)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.chiefComplaint.Name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    private init(): void {
        this.validateGeneratedName =
            this.validateGeneratedName.bind(this);
    }

    private resetNewChiefComplaintMappingForm(): void {
        this.chiefComplaint = new ChiefComplaint();

        this.hpiTemplates = [];
        this.peTemplates = [];
        this.rosTemplates = [];

        this.keywords = [];

        this.chiefComplaintValidationGroup
            .instance
            .reset();
    }

    private addKeywordsFromPatientAllegations(): void {
        if (this.allegations) {
            const allegationsList = this
                .splitString(this.allegations);
            for (let i = 0; i < allegationsList.length; i++) {
                const allegation = allegationsList[i];
                this.keywords.push(allegation);
            }
        }
    }

    private splitString(str: string): string[] {
        return str.split(this._delimiter)
            .map(a => a.trim());
    }

    private saveChiefComplaint(): Promise<any> {
        return this.chiefComplaintDataService
            .create(this.chiefComplaint);
    }

    private saveMappedTemplates(chiefComplaintId: string): Promise<any>[] {
        const templates = this.hpiTemplates
            .concat(this.peTemplates)
            .concat(this.rosTemplates);

        if (!templates.length) {
            return [Promise.resolve()];
        }

        const saveChiefComplaintMappedPromises = [];

        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];
            const templateId = template.Id;

            const newChiefComplaintMappedTemplate =
                new ChiefComplaintTemplate();
            newChiefComplaintMappedTemplate.ChiefComplaintId = chiefComplaintId;
            newChiefComplaintMappedTemplate.TemplateId = templateId;

            saveChiefComplaintMappedPromises
                .push(this.chiefComplaintTemplateDataService.create(newChiefComplaintMappedTemplate))
        }

        return saveChiefComplaintMappedPromises
    }

    private saveMappedKeywords(chiefComplaintId: string): Promise<any>[] {
        if (!this.keywords.length) {
            return [Promise.resolve()];
        }

        const saveMappedKeywordPromises = [];

        for (let i = 0; i < this.keywords.length; i++) {
            const keyword = this.keywords[i];
            saveMappedKeywordPromises
                .push(this.saveMappedKeyword(keyword, chiefComplaintId));
        }

        return saveMappedKeywordPromises;
    }

    private saveMappedKeyword(keyword: string, chiefComplaintId: string): Promise<any> {
        return this.getMissedKeywordId(keyword)
            .then(keywordId => {
                const newChiefComplaintRelatedKeyword =
                    new ChiefComplaintRelatedKeyword()
                newChiefComplaintRelatedKeyword.ChiefComplaintId = chiefComplaintId;
                newChiefComplaintRelatedKeyword.KeywordId = keywordId;

                return this.chiefComplaintRelatedKeywordDataService
                    .create(newChiefComplaintRelatedKeyword);
            });
    }

    private getMissedKeywordId(missedKeyword: string): Promise<string> {
        const loadOptions = {
            filter: ["Value", "=", missedKeyword]
        }

        return this.chiefComplaintKeywordDataService
            .firstOrDefault(loadOptions)
            .then(keyword => {
                if (keyword) {
                    return keyword.Id;
                }

                const chiefComplaintKeyword =
                    new ChiefComplaintKeyword();
                chiefComplaintKeyword.Value = missedKeyword;

                //we should create new keyword if not exists
                return this.chiefComplaintKeywordDataService
                    .create(chiefComplaintKeyword)
                    .then(() => {
                        return chiefComplaintKeyword.Id;
                    })

            })
    }
}

