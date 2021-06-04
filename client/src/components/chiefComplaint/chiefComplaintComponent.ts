import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../provider/dataService';
import { PatientDataModelTrackService } from '../../provider/patientDataModelTrackService';
import { PatienDataModelService } from '../../provider/patienDataModelService';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { BaseComponent } from '../baseComponent';
import { ToastService } from '../../provider/toastService';
import { TemplateSectionModel } from '../../dataModels/templateSectionModel';
import { AllegationsRelatedChiefComplaintsComponent } from './allegationsRelatedChiefComplaintsComponent';
import { PatientAllegationsSet } from '../../dataModels/patientAllegationsSet';
import { DxAlertService, AlertInfo } from '../../provider/dxAlertService';
import { DxAccordionComponent } from 'devextreme-angular';
import { LoadPanelService } from '../../provider/loadPanelService';
import { TemplateType } from '../../constants/templateType';
import { AppointmentDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { AppointmentAllegation } from '../appointmentAllegationsComponent/appointmentAllegationsComponent';
import { AppointmentAllegationsParser } from '../../provider/appointmentAllegationsParser';

@Component({
  templateUrl: 'chiefComplaintComponent.html',
  selector: 'chief-complaint'
})

export class ChiefComplaintComponent extends BaseComponent implements OnInit {
  @ViewChild("allegationsRelatedChiefComplaints") allegationsRelatedChiefComplaints: AllegationsRelatedChiefComplaintsComponent
  @ViewChild("patientAlegationListAccordion") patientAlegationListAccordion: DxAccordionComponent;

  @Input("patientAdmissionSection") patientAdmissionSection: any;
  @Input("patientAdmission") patientAdmission: any;
  @Input("appointmentId") appointmentId: string;

  @Input("isSignedOff") isSignedOff: boolean;

  appointmentAllegations: AppointmentAllegation[] = [];

  selectedPatientAllegationsSets: Array<any> = [];
  currentPatientAllegationSet: PatientAllegationsSet = new PatientAllegationsSet();
  isNewPatientAllegationsSet: boolean = true;
  isPatientAllegationsCreationFormVisible: boolean = false;

  keywordsSeparator: string = " ; ";
  allowChiefComplaintItemDeleting: boolean = true;
  addChiefComplaintsBtnOptions: any;

  chiefComplaintDataSource: any = {};

  selectedChiefComplaintId: string = "";
  patientChiefComplaint: any;

  constructor(
    private loadPanelService: LoadPanelService,
    private alertService: DxAlertService,
    dataService: DataService,
    toastService: ToastService,
    private patientDataModelTrackService: PatientDataModelTrackService,
    private patienDataModelService: PatienDataModelService,
    private appointmentDataService: AppointmentDataService) {

    super(dataService, toastService);
  }

  get isPatientAllegationsSetsEmpty(): boolean {
    return this.patientChiefComplaint
      .patientAllegationsSets.length === 0;
  }

  cancelPatientAllegationCreation() {
    this.isPatientAllegationsCreationFormVisible = false;
    this.currentPatientAllegationSet =
      new PatientAllegationsSet();

    this.isNewPatientAllegationsSet = true;
  }

  savePatientAllegationSet() {
    this.loadPanelService.showLoader();

    if (this.isNewPatientAllegationsSet) {
      this.patientChiefComplaint
        .patientAllegationsSets
        .push(this.currentPatientAllegationSet);

      this.saveChiefComplaintTemplatesToPatientDataTree(this.currentPatientAllegationSet.HpiTemplates,
        this.currentPatientAllegationSet.RosTemplates, this.currentPatientAllegationSet.PeTemplates);
    }

    this.patientDataModelTrackService
      .emitPatientDataModelChanges(true);

    this.isPatientAllegationsCreationFormVisible = false;

    this.currentPatientAllegationSet
      = new PatientAllegationsSet();

    this.isNewPatientAllegationsSet = true;

    this.loadPanelService.hideLoader();
  }

  addChiefComplaintTemplates($event) {
    const hpiTemplates = $event.hpi;
    const peTemplates = $event.pe;
    const rosTemplates = $event.ros;

    if (hpiTemplates.length) {
      this.currentPatientAllegationSet.HpiTemplates = hpiTemplates;
    }

    if (peTemplates.length) {
      this.currentPatientAllegationSet.PeTemplates = peTemplates;
    }

    if (rosTemplates.length) {
      this.currentPatientAllegationSet.RosTemplates = rosTemplates;
    }
  }

  addAllegationSet() {
    this.isPatientAllegationsCreationFormVisible = true;
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
      this.currentPatientAllegationSet = selectedPatientAllegationsSet;
      this.isNewPatientAllegationsSet = false;
      this.selectedPatientAllegationsSets = [];

      this.isPatientAllegationsCreationFormVisible = true;
    }
  }

  ngOnInit() {
    this.patientChiefComplaint = this.patientAdmissionSection.value;

    if (!this.patientChiefComplaint.patientAllegationsSets) {
      this.patientChiefComplaint.patientAllegationsSets = [];
    };

    this.appointmentDataService.getById(this.appointmentId)
      .then(appointment => {

        const allegations = appointment.Allegations;
        this.appointmentAllegations = allegations
          ? AppointmentAllegationsParser.parse(allegations)
          : [];
      });
  }

  deletePatientAllegationsSet($event, allegationSetId: string) {
    $event.event.stopPropagation();

    this.loadPanelService
      .showLoader();

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

    if (patientAllegationsSetToDelete.HpiTemplates.length) {
      this.deleteTemplatesFromPatientAdmission(TemplateType.hpi,
        patientAllegationsSetToDelete.HpiTemplates);
    }

    if (patientAllegationsSetToDelete.RosTemplates.length) {
      this.deleteTemplatesFromPatientAdmission(TemplateType.ros,
        patientAllegationsSetToDelete.RosTemplates);
    }

    if (patientAllegationsSetToDelete.PeTemplates.length) {
      this.deleteTemplatesFromPatientAdmission(TemplateType.hpi,
        patientAllegationsSetToDelete.PeTemplates);
    }

    this.patientChiefComplaint.patientAllegationsSets
      .splice(patientAllegationsSetIndexToDelete, 1);

    this.patientDataModelTrackService
      .emitPatientDataModelChanges(true);

    this.loadPanelService
      .hideLoader();
  }

  showAllegationsRelatedChiefComplaints($event) {
    $event.preventDefault();
    if (!this.currentPatientAllegationSet.Allegations) {
      const alertInfo = new AlertInfo(
        true, "Allegations are not set",
        100, 350, "Warning"
      );
      this.alertService.show(alertInfo);
      return;
    }
    this.allegationsRelatedChiefComplaints
      .showRelatedChiefComplaints();
  }

  private saveChiefComplaintTemplatesToPatientDataTree(hpiTemplates: any[],
    rosTemplates: any[], peTemplates: any[]): any {
    if (hpiTemplates.length) {
      this.addTemplatesToPatientAdmissionIfNeeded(TemplateType.hpi, hpiTemplates);
    }

    if (rosTemplates.length) {
      this.addTemplatesToPatientAdmissionIfNeeded(TemplateType.ros, rosTemplates);
    }

    if (peTemplates.length) {
      this.addTemplatesToPatientAdmissionIfNeeded(TemplateType.pe, peTemplates);
    }
  }

  private deleteTemplatesFromPatientAdmission(templateTypeName: string, templatesByType: Array<any>) {
    const patientAdmissionSection =
      this.patienDataModelService
        .getPatientAdmissionSectionByName(templateTypeName, this.patientAdmission);
    if (!patientAdmissionSection) {
      console.log(`${templateTypeName} was not found`);
      return;
    }

    const templateIds =
      templatesByType.map(t => t.TemplateId);

    const templateSectionIds = patientAdmissionSection.value
      .filter(ts => templateIds.indexOf(ts.Id) !== -1)
      .map(ts => ts.SectionId);

    const templateItemIndexesToDelete =
      ArrayHelper.indexesOf(patientAdmissionSection.value, "Id", templateIds);

    const templateSectionIndexesToDelete =
      ArrayHelper.indexesOf(patientAdmissionSection.children, "id", templateSectionIds);

    ArrayHelper
      .deleteByIndexes(patientAdmissionSection.value, templateItemIndexesToDelete);

    ArrayHelper
      .deleteByIndexes(patientAdmissionSection.children, templateSectionIndexesToDelete);

    this.adjustOrder(patientAdmissionSection.value, patientAdmissionSection.children);
  }

  private addTemplatesToPatientAdmissionIfNeeded(templateTypeName: string, templatesByType: Array<any>) {
    const patientAdmissionSection =
      this.patienDataModelService
        .getPatientAdmissionSectionByName(templateTypeName, this.patientAdmission);

    if (!patientAdmissionSection) {
      console.log(`${templateTypeName} was not found`);
      return;
    }

    const sectionTemplates = patientAdmissionSection.value;

    for (let i = 0; i < templatesByType.length; i++) {
      const newlyAddedTemplate = templatesByType[i];
      const isTemplateAlreadyAdded = !!sectionTemplates
        .filter(t => t.Id === newlyAddedTemplate.Id)[0];

      if (isTemplateAlreadyAdded) {
        continue;
      }

      const newlyCreatedSectionId = this.dataService
        .generateGuid();

      const templateSectionModel =
        new TemplateSectionModel(newlyAddedTemplate.TemplateId,
          newlyAddedTemplate.Name, newlyAddedTemplate.TemplateOrder, newlyAddedTemplate.ReportTitle, newlyCreatedSectionId);

      sectionTemplates.push(templateSectionModel);

      let templateSection = this.patienDataModelService
        .createPatientAdmissionTemplateSection(patientAdmissionSection.Id,
          templateTypeName, newlyAddedTemplate.Name, newlyAddedTemplate.ReportTitle, { order: newlyAddedTemplate.TemplateOrder }, newlyCreatedSectionId);

      patientAdmissionSection.children.push(templateSection);

      this.adjustOrder(sectionTemplates, patientAdmissionSection.children);
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