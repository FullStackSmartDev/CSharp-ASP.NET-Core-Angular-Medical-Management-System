import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from "@angular/core";
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DxFormComponent } from 'devextreme-angular';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { ChiefComplaintService } from 'src/app/_services/chief-complaint.service';
import { AlertService } from 'src/app/_services/alert.service';
import { TemplateTypeMappingComponent } from './template-type-mapping/template-type-mapping.component';
import { KeywordMappingComponent } from './keyword-mapping/keyword-mapping.component';
import { PredefinedTemplateTypeNames } from 'src/app/_classes/predefinedTemplateTypeNames';
import { TemplateTypeService } from 'src/app/administration/services/template-type.service';

@Component({
    selector: "template-keyword-mapping-form",
    templateUrl: "./template-keyword-mapping-form.component.html"
})
export class TemplateKeywordMappingFormComponent extends BaseAdminComponent implements OnInit {
    @Input() isNewMapping: boolean;
    @Input() mapping;
    @Input() companyId: string;
    @Input() keywordsString: string;

    @Output() onMappingSaved: EventEmitter<void> = new EventEmitter();

    @ViewChild("mappingForm", { static: false }) mappingForm: DxFormComponent;

    @ViewChild("hpiTemplateMapping", { static: false }) hpiTemplateMapping: TemplateTypeMappingComponent;
    @ViewChild("rosTemplateMapping", { static: false }) rosTemplateMapping: TemplateTypeMappingComponent;
    @ViewChild("physicalExamTemplateMapping", { static: false }) physicalExamTemplateMapping: TemplateTypeMappingComponent;

    @ViewChild("keywordTemplateMapping", { static: false }) keywordTemplateMapping: KeywordMappingComponent;

    areTemplateIdsSet: boolean = false;

    hpiTemplateTypeId: string = "";
    rosTemplateTypeId: string = "";
    physicalExamTemplateTypeId: string = "";

    newKeywordsToAdd: string[] = [];

    constructor(private entityNameService: EntityNameService,
        private chiefComplaintService: ChiefComplaintService,
        private alertService: AlertService,
        private templateTypeService: TemplateTypeService) {
        super();
    }

    ngOnInit(): void {
        this.initTemplateTypes();
        this.setNewKeyWordsToAdd();
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.chiefComplaintService, this.companyId)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.mapping.chiefComplaint.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    createUpdateMapping() {
        const validationResult = this.mappingForm.instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewMapping)
            this.mapping.chiefComplaint.companyId = this.companyId;

        this.chiefComplaintService.save(this.mapping.chiefComplaint)
            .then((chiefComplaint) => {
                const hpiTemplateIdsToSave = this.hpiTemplateMapping.getTemplateIdsToSave();
                const rosTemplateIdsToSave = this.rosTemplateMapping.getTemplateIdsToSave();
                const physicalExamTemplateIdsToSave = this.physicalExamTemplateMapping.getTemplateIdsToSave();

                const templateIdsToSave = hpiTemplateIdsToSave
                    .concat(rosTemplateIdsToSave)
                    .concat(physicalExamTemplateIdsToSave);

                let saveChiefComplaintTemplatesPromise = Promise.resolve();

                if (templateIdsToSave.length)
                    saveChiefComplaintTemplatesPromise = this.chiefComplaintService
                        .saveChiefComplaintTemplates(chiefComplaint.id, templateIdsToSave);

                const saveChiefComplaintKeywordsPromise = this.keywordTemplateMapping.save(chiefComplaint.id);

                return Promise.all([saveChiefComplaintTemplatesPromise, saveChiefComplaintKeywordsPromise])
                    .then(() => {
                        this.onMappingSaved.next();
                    });
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));

    }

    private setNewKeyWordsToAdd() {
        if (this.keywordsString) {
            this.newKeywordsToAdd = this.keywordsString.split(",");
        }
    }

    private initTemplateTypes() {
        this.templateTypeService.getByCompanyId(this.companyId)
            .then(templateTypes => {
                this.hpiTemplateTypeId = templateTypes
                    .find(t => t.name === PredefinedTemplateTypeNames.hpi)
                    .id;

                this.rosTemplateTypeId = templateTypes
                    .find(t => t.name === PredefinedTemplateTypeNames.ros)
                    .id;

                this.physicalExamTemplateTypeId = templateTypes
                    .find(t => t.name === PredefinedTemplateTypeNames.physicalExam)
                    .id;

                this.areTemplateIdsSet = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}