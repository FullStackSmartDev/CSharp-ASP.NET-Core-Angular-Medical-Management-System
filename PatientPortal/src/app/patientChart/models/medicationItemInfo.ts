export class MedicationItemInfo {
    medicationNameId: string;
    route: string;
    strength: string;
    unit: string;
    dosageForm: string;

    constructor(medicationNameId: string = "",
        route: string = "", dose = "", dosageForm: string = "", units: string = "") {
        this.medicationNameId = medicationNameId;
        this.route = route;
        this.strength = dose;
        this.unit = units;
        this.dosageForm = dosageForm;
    }
}