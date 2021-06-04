import { Component, Input, ViewChild } from '@angular/core';
import { PatientAllegationsSet } from 'src/app/patientChart/models/patientAllegationsSet';
import { AlertService } from 'src/app/_services/alert.service';
import { PatientChartTrackService } from '../../../../../_services/patient-chart-track.service';
import { AppointmentService } from 'src/app/_services/appointment.service';
import { ChiefComplaintManagementComponent } from '../chief-complaint-management/chief-complaint-management.component';
import { Template } from 'src/app/_models/template';
import { PredefinedTemplateTypeNames } from 'src/app/_classes/predefinedTemplateTypeNames';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeManagementService } from 'src/app/patientChart/services/patient-chart-node-management.service';
import { ArrayHelper } from 'src/app/_helpers/array.helper';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { TemplateNodeInfo } from 'src/app/patientChart/models/templateNodeInfo';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';
import { TemplateService } from 'src/app/_services/template.service';

@Component({
  templateUrl: 'chief-complaint.component.html',
  selector: 'chief-complaint',
  styles: [
    "div.chief-complaint-allegations { cursor: pointer; }"
  ]
})

export class ChiefComplaintComponent {
  @ViewChild("chiefComplaintManagementPopup", { static: false }) chiefComplaintManagementPopup: ChiefComplaintManagementComponent

  @Input() patientChartNode: PatientChartNode;
  @Input() patientChartDocumentNode: PatientChartNode;
  @Input() appointmentId: string;
  @Input() companyId: string;

  @Input() isSignedOff: boolean;

  isAllegationsPopupOpened: boolean = false;

  appointmentAllegations: string[] = [];

  selectedPatientAllegationsSets: Array<any> = [];
  allegationSet: PatientAllegationsSet = new PatientAllegationsSet();
  isNewPatientAllegationsSet: boolean = true;
  isPatientAllegationsFormVisible: boolean = false;

  keywordsSeparator: string = " ; ";
  allowChiefComplaintItemDeleting: boolean = true;

  selectedChiefComplaintId: string = "";
  patientChiefComplaint: any;

  constructor(
    private alertService: AlertService,
    private patientChartTrackService: PatientChartTrackService,
    private appointmentService: AppointmentService,
    private patientChartNodeManagementService: PatientChartNodeManagementService,
    private templateService: TemplateService) {
  }

  get isPatientAllegationsSetsEmpty(): boolean {
    return this.patientChiefComplaint
      .patientAllegationsSets.length === 0;
  }

  onChiefComplaintAllegationsClick() {
    this.isAllegationsPopupOpened = true;
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

    this.patientChartTrackService.emitPatientChartChanges(PatientChartNodeType.ChiefComplaintNode);
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
    this.patientChiefComplaint = this.patientChartNode.value;

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

  onNewAllegationsAdded(newAllegations: string) {
    this.allegationSet.allegations = newAllegations;
    this.isAllegationsPopupOpened = false;
  }

  deletePatientAllegationsSet($event, allegationSetId: string) {
    $event.stopPropagation();

    const confirmationPopup = this.alertService.confirm("Are you sure you want to delete chief complaints ?", "Confirm deletion");

    confirmationPopup.then(dialogResult => {
      if (dialogResult) {
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
          this.deleteTemplatesFromPatientChart(PredefinedTemplateTypeNames.hpi,
            patientAllegationsSetToDelete.hpiTemplates);
        }

        if (patientAllegationsSetToDelete.rosTemplates.length) {
          this.deleteTemplatesFromPatientChart(PredefinedTemplateTypeNames.ros,
            patientAllegationsSetToDelete.rosTemplates);
        }

        if (patientAllegationsSetToDelete.peTemplates.length) {
          this.deleteTemplatesFromPatientChart(PredefinedTemplateTypeNames.physicalExam,
            patientAllegationsSetToDelete.peTemplates);
        }

        this.patientChiefComplaint.patientAllegationsSets
          .splice(patientAllegationsSetIndexToDelete, 1);

        this.patientChartTrackService
          .emitPatientChartChanges(PatientChartNodeType.ChiefComplaintNode);
      }
    });
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
      this.addTemplatesToPatientСhartIfNeeded(PredefinedTemplateTypeNames.hpi, hpiTemplates);
    }

    if (rosTemplates.length) {
      this.addTemplatesToPatientСhartIfNeeded(PredefinedTemplateTypeNames.ros, rosTemplates);
    }

    if (peTemplates.length) {
      this.addTemplatesToPatientСhartIfNeeded(PredefinedTemplateTypeNames.physicalExam, peTemplates);
    }
  }

  private deleteTemplatesFromPatientChart(templateTypeName: string, templatesByType: Array<any>) {
    const patientChartTemplateListNode =
      this.patientChartNodeManagementService
        .getByName(templateTypeName, this.patientChartDocumentNode);

    if (!patientChartTemplateListNode)
      return;

    const templateIds = templatesByType.map(t => t.id);

    const templateSectionIds = patientChartTemplateListNode.value
      .filter(ts => templateIds.indexOf(ts.id) !== -1)
      .map(ts => ts.sectionId);

    const patientChartTemplateListNodeValue =
      patientChartTemplateListNode.value;

    const patientChartTemplateListNodeChildren =
      patientChartTemplateListNode.children;

    const templateItemIndexesToDelete =
      ArrayHelper.indexesOf(patientChartTemplateListNodeValue, "id", templateIds);

    const templateSectionIndexesToDelete =
      ArrayHelper.indexesOf(patientChartTemplateListNodeChildren, "id", templateSectionIds);

    ArrayHelper.deleteByIndexes(patientChartTemplateListNodeValue, templateItemIndexesToDelete);
    ArrayHelper.deleteByIndexes(patientChartTemplateListNodeChildren, templateSectionIndexesToDelete);

    this.adjustOrder(patientChartTemplateListNodeValue, patientChartTemplateListNodeChildren);
  }

  private addTemplatesToPatientСhartIfNeeded(templateTypeName: string, templatesByType: Template[]) {
    const patientChartTemplateListNode = this.patientChartNodeManagementService
      .getByName(templateTypeName, this.patientChartDocumentNode);

    if (!patientChartTemplateListNode)
      return;

    //patientChartTemplateListNodeValue contains the list of added templates
    const patientChartTemplateListNodeValue = patientChartTemplateListNode.value;

    for (let i = 0; i < templatesByType.length; i++) {
      const newlyAddedTemplate = templatesByType[i];
      const isTemplateAlreadyAdded = !!patientChartTemplateListNodeValue
        .find(t => t.id === newlyAddedTemplate.id);

      if (isTemplateAlreadyAdded)
        continue;

      this.templateService.getById(newlyAddedTemplate.id)
        .then(template => {
          const newlyCreatedNodeId = GuidHelper.generateNewGuid();

          const templateNodeInfo =
            new TemplateNodeInfo(newlyAddedTemplate.id,
              newlyAddedTemplate.templateOrder, newlyAddedTemplate.reportTitle, newlyCreatedNodeId);

          patientChartTemplateListNodeValue.push(templateNodeInfo);

          let templateNode = PatientChartNode
            .createPatientChartTemplateNode(newlyCreatedNodeId, patientChartTemplateListNode.id,
              template, templateTypeName);

          if (!patientChartTemplateListNode.children)
            patientChartTemplateListNode.children = [];

          patientChartTemplateListNode.children.push(templateNode);

          this.adjustOrder(patientChartTemplateListNodeValue, patientChartTemplateListNode.children);
        })
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