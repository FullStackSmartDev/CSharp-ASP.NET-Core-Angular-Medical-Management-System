import { Injectable } from "@angular/core";
import { TemplateLookupItemValidationDataService } from "../dataServices/read/templateLookupItemValidationDataService";
import { AlertService } from "../alertService";
import { ControlDefaultValues } from "../../constants/controlDefaultValues";

@Injectable()
export class LookupItemsAppService {
    constructor(private templateLookupItemValidationDataService: TemplateLookupItemValidationDataService,
        private alertService: AlertService) {
    }

    setLookupItemLists(lookupItemListMetadata: LookupItemListMetadata[], component: any) {
        const lookupItemListNames = lookupItemListMetadata.map(l => l.name);
        
        this.initLookupItems(lookupItemListNames, component);

        const lookupItemListPromises = [];

        for (let i = 0; i < lookupItemListNames.length; i++) {
            const lookupItemListName = lookupItemListNames[i];
            const lookupItemListPromise = this.templateLookupItemValidationDataService
                .getByName(lookupItemListName);

            lookupItemListPromises
                .push(lookupItemListPromise);
        }

        Promise.all(lookupItemListPromises)
            .then(results => {
                const errorMessages: string[] = [];
                for (let i = 0; i < results.length; i++) {

                    const lookupItemListName = lookupItemListNames[i];
                    const lookupItemList = results[i];
                    const result = lookupItemList.success;
                    const lookupItemListValues = lookupItemList.values;

                    if (result) {
                        const values = lookupItemListValues.filter(l => !l.IsDelete)
                            .map(l => l.Value);

                        const includeNotSetValue = lookupItemListMetadata
                            .filter(l => l.name === lookupItemListName)[0]
                            .includeNotSetValue;

                        if (includeNotSetValue) {
                            values.push(ControlDefaultValues.selectBox);
                        }

                        const defaultValue = lookupItemListValues
                            .filter(l => !l.IsDelete && l.IsDefault)[0];

                        component[lookupItemListName] = {
                            values: values,
                            defaultValue: defaultValue ? defaultValue.Value : values[0]
                        }
                    }
                    else {
                        errorMessages
                            .push(lookupItemList.errorMessage);
                    }
                }

                if (errorMessages.length) {
                    this.alertService.warning(errorMessages.join("\n"));
                }
            });
    }

    private initLookupItems(lookupItemListNames: string[], component: any) {
        for (let i = 0; i < lookupItemListNames.length; i++) {
            const lookupItemListName = lookupItemListNames[i];
            component[lookupItemListName] = [];
        }
    }
}

export class LookupItemListMetadata {
    name: string;
    includeNotSetValue: boolean;

    constructor(name: string, includeNotSetValue: boolean = false) {
        this.name = name;
        this.includeNotSetValue = includeNotSetValue;
    }
}