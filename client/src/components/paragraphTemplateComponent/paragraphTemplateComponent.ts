import { Component, Input, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ObjectHelpers } from '../../helpers/objectHelpers';
import { ToastService } from '../../provider/toastService';
import { PatientDataModelTrackService } from '../../provider/patientDataModelTrackService';
import { TemplateDataService, AdmissionDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { DxAlertService, AlertInfo } from '../../provider/dxAlertService';
import { PatientRichTextEditorComponent } from '../templateSelectableItemsManagement/base/patientRichTextEditorComponent';
import { TemplateType } from '../../constants/templateType';
import { TemplatesContentChecker } from '../../provider/appServices/templatesWordsChecker';
import { Template } from '../../dataModels/template';
import { PatienDataModelService } from '../../provider/patienDataModelService';
import * as $ from "jquery";

@Component({
  templateUrl: 'paragraphTemplateComponent.html',
  selector: 'paragraph-template'
})

export class ParagraphTemplateComponent implements OnInit {
  @Input() patientAdmission: any;
  @Input() patientConfigurationNodeDataModel: any;
  @Input() templateType: string;
  @Input() templateName: string;
  @Input() admissionId: string;
  @Input() patientId: string;
  @Input("isSignedOff") isSignedOff: boolean;

  @ViewChild("detailedRichTextEditor") detailedRichTextEditor: PatientRichTextEditorComponent;
  @ViewChild("defaultRichTextEditor") defaultRichTextEditor: PatientRichTextEditorComponent;

  isDuplicateWordsWarningVisible: boolean = false;

  isDetailedEditorReady: boolean = false;
  isDefaultEditorReady: boolean = false;

  duplicateWords: string[] = [];

  get duplicateWordsText(): string {
    return this.duplicateWords.length
      ? this.duplicateWords.join(", ")
      : "";
  }

  templateContent: any = {
    DefaultTemplateHtml: "",
    DetailedTemplateHtml: "",
    IsDetailedTemplateUsed: false
  };

  get templateResult(): string {
    return this.isDetailedTemplate
      ? this.templateContent.DetailedTemplateHtml
      : this.templateContent.DefaultTemplateHtml;
  }

  templateStates: Array<string> = ["Default", "Detailed"];

  get templateState(): string {
    return this.templateStates[this.isDetailedTemplate ? 1 : 0];
  }

  isDetailedTemplate: boolean;
  hasDefaultTemplate: boolean;

  constructor(private templateDataService: TemplateDataService,
    private alertService: DxAlertService,
    private toastService: ToastService,
    private patientDataModelTrackService: PatientDataModelTrackService,
    private templatesContentChecker: TemplatesContentChecker,
    private admissionDataService: AdmissionDataService,
    private patienDataModelService: PatienDataModelService) { }

  onTemplateStateChanged($event) {
    this.isDetailedTemplate = $event.value === this.templateStates[1];

    this.templateContent.IsDetailedTemplateUsed =
      this.isDetailedTemplate;

    this.processDuplicateWordsIfNeeded();

    this.patientDataModelTrackService
      .emitPatientDataModelChanges(true);
  }

  toggleDuplicateWordsWarning() {
    this.isDuplicateWordsWarningVisible =
      !this.isDuplicateWordsWarningVisible
  }

  ngOnInit() {
    //case when we already have saved template data in admission
    if (!ObjectHelpers.isObjectEmpty(this.patientConfigurationNodeDataModel)) {
      this.templateContent = this.patientConfigurationNodeDataModel.templateContent;
      if (this.templateContent.DefaultTemplateHtml && !this.templateContent.IsDetailedTemplateUsed) {
        this.hasDefaultTemplate = true;
        this.isDetailedTemplate = false;
      }
      else {
        this.hasDefaultTemplate = !!this.templateContent.DefaultTemplateHtml;
        this.isDetailedTemplate = true;
      }
    }

    else {
      if (!this.templateName || !this.templateType) {
        throw "Template name and template type should be specified";
      }
      this.templateDataService
        .firstOrDefault({
          filter: ["Name", "=", this.templateName]
        }).then((template) => {

          if (!template) {
            this.alertService
              .show(new AlertInfo(true, `Template with name: ${this.templateName} was not found.`, 100, 200, "Error"));
            return;
          }

          this.previousDetailedTemplateContent(template)
            .then(previousTemplateContent => {
              if (previousTemplateContent) {
                const previousDetailedContent =
                  this.cleanUpDetailedContent(previousTemplateContent);

                this.templateContent.DetailedTemplateHtml =
                  `${previousDetailedContent}${template.DetailedTemplateHtml}`;

              } else {
                this.templateContent.DetailedTemplateHtml =
                  template.DetailedTemplateHtml;
              }

              this.templateContent.DefaultTemplateHtml =
                template.DefaultTemplateHtml;

              this.patientConfigurationNodeDataModel.templateContent =
                this.templateContent;

              if (this.templateContent.DefaultTemplateHtml) {
                this.hasDefaultTemplate = true;
                this.isDetailedTemplate = false;
              }
              else {
                this.hasDefaultTemplate = false;
                this.isDetailedTemplate = true;
                this.templateContent.IsDetailedTemplateUsed =
                  this.isDetailedTemplate;
              }
            });

        })
        .catch(error => {
          this.toastService.showErrorMessage(error.message ? error.message : error);
        });
    }
  }

  private cleanUpDetailedContent(detailedHtmlStr: string): string {
    const detailedHtml = $.parseHTML(`<div>${detailedHtmlStr}</div>`);
    const detailedHtmlWrapper = $(detailedHtml);
    const selectableSpans = detailedHtmlWrapper.find("span[metadata]");

    selectableSpans
      .removeAttr("metadata")
      .removeAttr("id");

    return detailedHtmlWrapper.html();
  }

  onDetailedContentChanged($event) {
    this.templateContent.DetailedTemplateHtml = $event;
    this.processDuplicateWordsIfNeeded();
    this.patientDataModelTrackService
      .emitPatientDataModelChanges(true);
  }

  onDefaultContentChanged($event) {
    this.templateContent.DefaultTemplateHtml = $event;
    this.patientDataModelTrackService.emitPatientDataModelChanges(true);
  }

  onDefaultContentReady($event) {
    this.isDefaultEditorReady = $event;
  }

  onDetailedContentReady($event) {
    this.isDetailedEditorReady = $event;
  }

  get isRosTemplate(): boolean {
    return this.templateType && this.templateType === TemplateType.ros;
  }

  private previousDetailedTemplateContent(template: Template): Promise<string> {
    const isHistoricalTemplate = template.IsHistorical;

    if (!isHistoricalTemplate) {
      return Promise.resolve("")
    }

    return this.getPreviousPatientAdmissions()
      .then(previousAdmissions => {
        if (!previousAdmissions || !previousAdmissions.length) {
          return "";
        }

        for (let i = 0; i < previousAdmissions.length; i++) {
          const previousAdmission = previousAdmissions[i];

          const templatesSection = this.patienDataModelService
            .getPatientAdmissionSectionByName(this.templateType, previousAdmission);

          if (!templatesSection || !templatesSection.children || !templatesSection.children.length) {
            continue;
          }

          var previousTemplate = templatesSection.children.filter(c => {
            return c.name === this.templateName && c.value
              && c.value.templateContent
              && c.value.templateContent.IsDetailedTemplateUsed;
          })[0];

          if (previousTemplate) {
            return previousTemplate.value
              .templateContent.DetailedTemplateHtml;
          }
        }

      });
  }

  private getPreviousPatientAdmissions(): Promise<any[]> {
    return this.admissionDataService.getById(this.admissionId)
      .then(admission => {
        const patientFilter = ["PatientDemographicId", "=", this.patientId];
        const createDateFilter = ["CreatedDate", "<", admission.CreatedDate];

        const filter = [patientFilter, "and", createDateFilter];
        const sort = [{ selector: "CreatedDate", desc: true }];

        const loadOptions = {
          filter: filter,
          sort: sort
        };

        return this.admissionDataService.search(loadOptions)
          .then(admissions => {
            if (!admissions || !admissions.length) {
              return [];
            }

            return admissions.map(a => {
              return JSON.parse(a.AdmissionData)
                .patientRoot;
            });

          })
      })
  }

  private processDuplicateWordsIfNeeded(): void {
    if (this.isDetailedTemplate && this.isRosTemplate) {
      this.duplicateWords = this.templatesContentChecker
        .findDuplicateWords(this.templateContent.DetailedTemplateHtml, TemplateType.hpi, this.patientAdmission);
    }
  }
}