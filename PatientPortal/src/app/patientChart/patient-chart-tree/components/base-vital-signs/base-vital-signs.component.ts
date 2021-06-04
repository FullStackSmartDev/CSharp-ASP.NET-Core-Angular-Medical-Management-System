import { Component, Input, ViewChild } from "@angular/core";
import { DxPopupComponent } from "devextreme-angular";
import { BaseVitalSigns } from "src/app/patientChart/models/baseVitalSigns";
import { PatientChartTrackService } from "../../../../_services/patient-chart-track.service";
import { AlertService } from "src/app/_services/alert.service";
import { BaseVitalSignsService } from "../../services/base-vital-signs.service";
import { MedicalCalculationHelper } from "src/app/_helpers/medical-calculation.helper";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { SelectableListConfig } from "src/app/_models/selectableListConfig";
import { PatientService } from "src/app/_services/patient.service";
import { DateHelper } from "src/app/_helpers/date.helper";
import { Constants } from 'src/app/_classes/constants';

@Component({
    templateUrl: "base-vital-signs.component.html",
    selector: "base-vital-signs"
})

export class BaseVitalSignsComponent {
    @Input() patientId: string;
    @Input() isSignedOff: boolean;
    @Input() companyId: string;

    @ViewChild("baseVitalSignsPopup", { static: false }) baseVitalSignsPopup: DxPopupComponent;

    baseVitalSigns: BaseVitalSigns;
    baseVitalSignsCopy: BaseVitalSigns;

    isNewBaseVitalSigns: boolean = true;

    isBaseVitalSignsPopupOpened: boolean = false;

    patientDateOfBirth: any = null;

    constructor(private alertService: AlertService,
        private baseVitalSignsService: BaseVitalSignsService,
        private patientChartTrackService: PatientChartTrackService,
        private selectableListService: SelectableListService,
        private patientService: PatientService) {
    }

    dominantHand: string[] = ["Right", "Left"];

    get oxygenUseListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, "oxygenUse");
    }

    get bmi(): string {
        const patientWeight = this.baseVitalSigns.weight;
        const patientHeight = this.baseVitalSigns.height;

        return MedicalCalculationHelper.calculateBmi(patientHeight, patientWeight);
    }

    get isHeadCircumferenceEnabled(): boolean {
        if (!this.patientDateOfBirth)
            return false;

        return DateHelper.getAge(this.patientDateOfBirth) <= 3;
    }

    get oxygenUseInfo(): string {
        const noSetMessage =
            Constants.messages.notSet;

        const oxygenUse = this.baseVitalSigns.oxygenUse || noSetMessage;
        const oxygenAmount = this.baseVitalSigns.oxygenAmount || noSetMessage;

        return oxygenUse === noSetMessage && oxygenAmount === noSetMessage
            ? ""
            : `${oxygenAmount} / ${oxygenUse}`;
    }

    onBaseVitalSignsPopupDisposing() {
        this.baseVitalSignsCopy = null;
    }

    ngOnInit(): void {
        this.init();
    }

    openBaseVitalSignsForm() {
        if (this.isNewBaseVitalSigns) {
            this.baseVitalSigns.dominantHand = this.dominantHand[0];
        }

        const baseVitalSignsString = JSON.stringify(this.baseVitalSigns);
        this.baseVitalSignsCopy = JSON.parse(baseVitalSignsString);

        this.baseVitalSignsCopy["isOxygenUse"] = !!this.baseVitalSignsCopy.oxygenUse
            || !!this.baseVitalSignsCopy.oxygenAmount;

        this.isBaseVitalSignsPopupOpened = true;
    }

    createUpdateBaseVitalSigns() {
        if (!this.baseVitalSignsCopy["isOxygenUse"]) {
            this.baseVitalSignsCopy.oxygenUse = null;
            this.baseVitalSignsCopy.oxygenAmount = null;
        }

        this.baseVitalSignsService.save(this.baseVitalSignsCopy)
            .then((vitalSigns) => {
                this.patientChartTrackService.emitPatientChartChanges(true);

                if (this.isNewBaseVitalSigns)
                    this.baseVitalSignsCopy.id = vitalSigns.id;

                this.baseVitalSigns = this.baseVitalSignsCopy;
                this.isBaseVitalSignsPopupOpened = false;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initBaseVitalSigns() {
        this.baseVitalSigns = new BaseVitalSigns();
        this.baseVitalSigns["isOxygenUse"] = false;

        this.baseVitalSignsService
            .getByPatientId(this.patientId)
            .then((baseVitalsigns) => {
                if (baseVitalsigns) {
                    this.baseVitalSigns = baseVitalsigns;
                    this.isNewBaseVitalSigns = false;
                }
                else {
                    this.baseVitalSigns.patientId = this.patientId;
                }
            });
    }

    private init(): any {
        this.initSelectableLists();
        this.initBaseVitalSigns();
        this.setPatientDateOfBirth();
    }

    private setPatientDateOfBirth() {
        this.patientService.getById(this.patientId)
            .then(patient => {
                this.patientDateOfBirth = patient.dateOfBirth;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    private initSelectableLists() {
        const oxygenUseListConfig = new SelectableListConfig(this.companyId, "oxygenUse");

        const selectableLists = [oxygenUseListConfig];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this);
    }
}