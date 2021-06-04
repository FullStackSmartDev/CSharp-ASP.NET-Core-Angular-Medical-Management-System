import { Injectable } from "@angular/core";
import { TemplateLookupItemDataService } from "./dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { PatientHistoryNames } from "../constants/patientHistoryNames";

@Injectable()
export class DefaultValuesProvider {
    private defaultValueProviders: { [id: string]: IDefaultValueProvider; } = {};

    constructor(private templateLookupItemDataService: TemplateLookupItemDataService) {
        this.registerProviders();
    }

    getByName(name: string): Promise<string> {
        const provider = this.defaultValueProviders[name];
        if (!provider) {
            console.log(`Default value provider is not registered: ${name}`)
            return Promise.resolve("");
        }

        return provider.getDefaultValue()
    }

    private registerProviders(): void {
        this.defaultValueProviders[PatientHistoryNames.tobaccoHistory] =
            new TobaccoHistoryDefaultValueProvider(this.templateLookupItemDataService);

        this.defaultValueProviders[PatientHistoryNames.drugHistory] =
            new DrugHistoryDefaultValueProvider(this.templateLookupItemDataService);

        this.defaultValueProviders[PatientHistoryNames.alcoholHistory] =
            new AlcoholHistoryDefaultValueProvider(this.templateLookupItemDataService);

        const medicalHistoryDefaultValueProvider =
            new MedicalHistoryDefaultValueProvider();
        this.defaultValueProviders[PatientHistoryNames.medicalHistory] = medicalHistoryDefaultValueProvider;

        this.defaultValueProviders[PatientHistoryNames.surgicalHistory] = medicalHistoryDefaultValueProvider;

        this.defaultValueProviders[PatientHistoryNames.medicalRecord] = medicalHistoryDefaultValueProvider;

        this.defaultValueProviders[PatientHistoryNames.familyHistory] = medicalHistoryDefaultValueProvider;

        this.defaultValueProviders[PatientHistoryNames.educationHistory] =
            new EducationHistoryDefaultValueProvider(this.templateLookupItemDataService);

        this.defaultValueProviders[PatientHistoryNames.occupationalHistory] =
            new OccupationalHistoryDefaultValueProvider(this.templateLookupItemDataService);

        this.defaultValueProviders[PatientHistoryNames.medicationsHistory] =
            new MedicationsHistoryDefaultValueProvider();

        this.defaultValueProviders[PatientHistoryNames.allergiesHistory] =
            new AllergiesHistoryDefaultValueProvider();
    }
}

abstract class SelectableListDefaultValueProvider {
    constructor(private templateLookupItemDataService: TemplateLookupItemDataService) {

    }

    getDefaultValue(): Promise<string> {
        const selectableListName = this.selectableListName;

        const isActiveFilter = ["IsActive", "=", true];
        const nameFilter = ["Name", "=", selectableListName];
        const filter = [isActiveFilter, "and", nameFilter];

        const loadOptions = {
            filter: filter
        }

        return this.templateLookupItemDataService
            .firstOrDefault(loadOptions)
            .then(selectableList => {
                if (!selectableList) {
                    return "";
                }

                const selectableItems =
                    JSON.parse(selectableList.JsonValues).Values;

                const defaultItem = selectableItems
                    .filter(li => li.IsDefault)[0];

                return defaultItem && defaultItem.Value
                    ? defaultItem.Value
                    : selectableItems.length ? selectableItems[0].Value : "";
            });
    }

    abstract selectableListName: string;
}

class TobaccoHistoryDefaultValueProvider
    extends SelectableListDefaultValueProvider
    implements IDefaultValueProvider {

    selectableListName: string = "statusTobaccoUse";
}

class DrugHistoryDefaultValueProvider
    extends SelectableListDefaultValueProvider
    implements IDefaultValueProvider {

    selectableListName: string = "statusDrugUse";
}

class AlcoholHistoryDefaultValueProvider
    extends SelectableListDefaultValueProvider
    implements IDefaultValueProvider {

    selectableListName: string = "statusEtohUse";
}

class MedicalHistoryDefaultValueProvider
    implements IDefaultValueProvider {

    getDefaultValue(): Promise<string> {
        return Promise.resolve("Unremarkable")
    }
}

class EducationHistoryDefaultValueProvider
    extends SelectableListDefaultValueProvider
    implements IDefaultValueProvider {

    selectableListName: string = "education";
}

class OccupationalHistoryDefaultValueProvider
    extends SelectableListDefaultValueProvider
    implements IDefaultValueProvider {

    selectableListName: string = "occupation";
}

class AllergiesHistoryDefaultValueProvider
    implements IDefaultValueProvider {
    getDefaultValue(): Promise<string> {
        return Promise.resolve("NKDA")
    }
}

class MedicationsHistoryDefaultValueProvider
    implements IDefaultValueProvider {
    getDefaultValue(): Promise<string> {
        return Promise.resolve("None")
    }
}

interface IDefaultValueProvider {
    getDefaultValue(): Promise<string>;
}