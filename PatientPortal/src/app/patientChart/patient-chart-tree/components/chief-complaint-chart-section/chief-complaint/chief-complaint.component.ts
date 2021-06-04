import { Component, Input, ViewChild } from '@angular/core';
import { PatientAllegationsSet } from 'src/app/patientChart/models/patientAllegationsSet';
import { AlertService } from 'src/app/_services/alert.service';
import { PatientChartTrackService } from '../../../../../_services/patient-chart-track.service';
import { PatientChartService } from 'src/app/patientChart/services/patient-chart.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { ArrayHelper } from 'src/app/_helpers/array.helper';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { TemplateSection } from 'src/app/patientChart/models/templateSection';
import { ChiefComplaintManagementComponent } from '../chief-complaint-management/chief-complaint-management.component';
import { Template } from 'src/app/_models/template';
import { PredefinedTemplateTypeNames } from 'src/app/_classes/predefinedTemplateTypeNames';

@Component({
  templateUrl: 'chief-complaint.component.html',
  selector: 'chief-complaint'
})

export class ChiefComplaintComponent {
  @ViewChild("chiefComplaintManagementPopup", { static: false }) chiefComplaintManagementPopup: ChiefComplaintManagementComponent
  // @ViewChild("patientAlegationListAccordion") patientAlegationListAccordion: DxAccordionComponent;

  @Input("patientChartSection") patientChartSection: any;
  @Input("patientChartTree") patientChartTree: any;
  @Input("appointmentId") appointmentId: string;
  @Input() companyId: string;

  @Input("isSignedOff") isSignedOff: boolean;

  appointmentAllegations: string[] = [];

  selectedPatientAllegationsSets: Array<any> = [];
  allegationSet: PatientAllegationsSet = new PatientAllegationsSet();
  isNewPatientAllegationsSet: boolean = true;
  isPatientAllegationsFormVisible: boolean = false;

  keywordsSeparator: string = " ; ";
  allowChiefComplaintItemDeleting: boolean = true;

  chiefComplaintDataSource: any = {};

  selectedChiefComplaintId: string = "";
  patientChiefComplaint: any;

  constructor(
    private alertService: AlertService,
    private patientChartTrackService: PatientChartTrackService,
    private patientChartService: PatientChartService,
    private appointmentService: AppointmentService) {
  }

  get isPatientAllegationsSetsEmpty(): boolean {
    return this.patientChiefComplaint
      .patientAllegationsSets.length === 0;
  }

  cancelPatientAllegationCreation() {
    this.isPatientAllegationsFormVisible = false;
    this.allegationSet = new PatientAllegationsSet();

    this.isNewPatientAllegationsSet = true;
  }

  savePatientAllegationSet() {
    if (this.isNewPatientAllegationsSet) {

      if (!this.allegationSet.allegations) {
        this.alertService.warning("Allegations are not specified");
        return;
      }

      this.patientChiefComplaint
        .patientAllegationsSets
        .push(this.allegationSet);

      this.saveChiefComplaintTemplatesToPatientDataTree(this.allegationSet.hpiTemplates,
        this.allegationSet.rosTemplates, this.allegationSet.peTemplates);
    }

    this.patientChartTrackService.emitPatientChartChanges(true);
    this.isPatientAllegationsFormVisible = false;
    this.allegationSet = new PatientAllegationsSet();
    this.isNewPatientAllegationsSet = true;
  }

  addTemplates($event) {
    const hpiTemplates = $event.hpi;
    const peTemplates = $event.pe;
    const rosTemplates = $event.ros;

    if (hpiTemplates.length) {
      this.allegationSet.hpiTemplates = hpiTemplates;
    }

    if (peTemplates.length) {
      this.allegationSet.peTemplates = peTemplates;
    }

    if (rosTemplates.length) {
      this.allegationSet.rosTemplates = rosTemplates;
    }
  }

  addAllegationSet() {
    this.isPatientAllegationsFormVisible = true;
  }

  onPatientAllegationSetSelected($event) {
    if (this.isSignedOff) {
      this.selectedPatientAllegationsSets = [];
      return;
    }

    const patientAllegationsSet = $event.selectedRowsData[0];
    if (!patientAllegationsSet || !patientAllegationsSet.Id) {
      return;
    }

    const patientAllegationsSetId =
      patientAllegationsSet.Id;

    const selectedPatientAllegationsSet = this.patientChiefComplaint
      .patientAllegationsSets
      .filter(s => s.Id === patientAllegationsSetId)[0];

    if (selectedPatientAllegationsSet) {
      this.allegationSet = selectedPatientAllegationsSet;
      this.isNewPatientAllegationsSet = false;
      this.selectedPatientAllegationsSets = [];

      this.isPatientAllegationsFormVisible = true;
    }
  }

  ngOnInit() {
    this.patientChiefComplaint = this.patientChartSection.value;

    if (!this.patientChiefComplaint.patientAllegationsSets) {
      this.patientChiefComplaint.patientAllegationsSets = [];
    };

    this.appointmentService.getById(this.appointmentId)
      .then(appointment => {

        const allegations = appointment.allegations;
        if (allegations) {
          this.appointmentAllegations = allegations.split(", ");
        }
      });
  }

  deletePatientAllegationsSet($event, allegationSetId: string) {
    $event.stopPropagation();

    let patientAllegationsSetToDelete;
    let patientAllegationsSetIndexToDelete;

    for (let i = 0; i < this.patientChiefComplaint.patientAllegationsSets.length; i++) {
      const patientAllegationsSet = this
        .patientChiefComplaint.patientAllegationsSets[i];

      if (patientAllegationsSet.Id === allegationSetId) {
        patientAllegationsSetToDelete = patientAllegationsSet;
        patientAllegationsSetIndexToDelete = i;
      }
    }

    if (patientAllegationsSetToDelete.hpiTemplates.length) {
      this.deleteTemplatesFromPatientAdmission(PredefinedTemplateTypeNames.hpi,
        patientAllegationsSetToDelete.hpiTemplates);
    }

    if (patientAllegationsSetToDelete.rosTemplates.length) {
      this.deleteTemplatesFromPatientAdmission(PredefinedTemplateTypeNames.ros,
        patientAllegationsSetToDelete.rosTemplates);
    }

    if (patientAllegationsSetToDelete.peTemplates.length) {
      this.deleteTemplatesFromPatientAdmission(PredefinedTemplateTypeNames.physicalExam,
        patientAllegationsSetToDelete.peTemplates);
    }

    this.patientChiefComplaint.patientAllegationsSets
      .splice(patientAllegationsSetIndexToDelete, 1);

    this.patientChartTrackService.emitPatientChartChanges(true);
  }

  showAllegationsRelatedChiefComplaints() {
    if (!this.allegationSet.allegations) {
      this.alertService.warning("Allegations are not specified");
      return;
    }

    this.chiefComplaintManagementPopup.show();
  }

  private saveChiefComplaintTemplatesToPatientDataTree(hpiTemplates: any[],
    rosTemplates: any[], peTemplates: any[]): any {
    if (hpiTemplates.length) {
      this.addTemplatesToPatientСhartTreeIfNeeded(PredefinedTemplateTypeNames.hpi, hpiTemplates);
    }

    if (rosTemplates.length) {
      this.addTemplatesToPatientСhartTreeIfNeeded(PredefinedTemplateTypeNames.ros, rosTemplates);
    }

    if (peTemplates.length) {
      this.addTemplatesToPatientСhartTreeIfNeeded(PredefinedTemplateTypeNames.physicalExam, peTemplates);
    }
  }

  private deleteTemplatesFromPatientAdmission(templateTypeName: string, templatesByType: Array<any>) {
    const patientAdmissionSection =
      this.patientChartService
        .getPatientChartSectionByName(templateTypeName, this.patientChartTree);

    if (!patientAdmissionSection) {
      return;
    }

    const templateIds = templatesByType.map(t => t.TemplateId);

    const templateSectionIds = patientAdmissionSection.value
      .filter(ts => templateIds.indexOf(ts.Id) !== -1)
      .map(ts => ts.SectionId);

    const templateItemIndexesToDelete =
      ArrayHelper.indexesOf(patientAdmissionSection.value, "Id", templateIds);

    const templateSectionIndexesToDelete =
      ArrayHelper.indexesOf(patientAdmissionSection.children, "id", templateSectionIds);

    ArrayHelper.deleteByIndexes(patientAdmissionSection.value, templateItemIndexesToDelete);
    ArrayHelper.deleteByIndexes(patientAdmissionSection.children, templateSectionIndexesToDelete);

    this.adjustOrder(patientAdmissionSection.value, patientAdmissionSection.children);
  }

  private addTemplatesToPatientСhartTreeIfNeeded(templateTypeName: string, templatesByType: Template[]) {
    const patientTemplateListSection = this.patientChartService
      .getPatientChartSectionByName(templateTypeName, this.patientChartTree);

    if (!patientTemplateListSection) {
      return;
    }

    const sectionTemplates = patientTemplateListSection.value;

    for (let i = 0; i < templatesByType.length; i++) {
      const newlyAddedTemplate = templatesByType[i];
      const isTemplateAlreadyAdded = !!sectionTemplates
        .filter(t => t.id === newlyAddedTemplate.id)[0];

      if (isTemplateAlreadyAdded) {
        continue;
      }

      const newlyCreatedSectionId = GuidHelper.generateNewGuid();

      const templateSectionModel =
        new TemplateSection(newlyAddedTemplate.id,
          newlyAddedTemplate.name, newlyAddedTemplate.templateOrder, newlyAddedTemplate.reportTitle, newlyCreatedSectionId);

      sectionTemplates.push(templateSectionModel);

      let templateSection = this.patientChartService
        .createPatientChartTemplateSection(patientTemplateListSection.id,
          templateTypeName, newlyAddedTemplate, { order: newlyAddedTemplate.templateOrder }, newlyCreatedSectionId);

      patientTemplateListSection.children.push(templateSection);

      this.adjustOrder(sectionTemplates, patientTemplateListSection.children);
    }
  }

  private adjustOrder(sectionTemplates: Array<any>, sectionChildrens: Array<any>) {
    this.adjustSectionTemplatesOrder(sectionTemplates);
    this.adjustSectionChildrenOrder(sectionChildrens);
  }

  private adjustSectionTemplatesOrder(sectionTemplates: Array<any>) {
    sectionTemplates
      .sort((t1, t2) => t1.Order - t2.Order);
  }

  private adjustSectionChildrenOrder(sectionChildren: Array<any>) {
    sectionChildren
      .sort((s1, s2) => s1.attributes.order - s2.attributes.order);
  }
}