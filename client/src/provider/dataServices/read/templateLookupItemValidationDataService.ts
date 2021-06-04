import { TemplateLookupItemDataService } from "../readCreateUpdate/readCreateUpdateDataServices";
import { Injectable } from "@angular/core";

@Injectable()
export class TemplateLookupItemValidationDataService {
    constructor(private templateLookupItemDataService: TemplateLookupItemDataService) {
    }

    getByName(name: string): Promise<LookupItemResult> {
        return this.templateLookupItemDataService
            .getByNameActiveOnly(name)
            .then(lookupItem => {
                let lookupItemResult: LookupItemResult;
                if (lookupItem) {
                    const values = JSON.parse(lookupItem.JsonValues)
                        .Values
                    lookupItemResult = LookupItemResult
                        .createSuccessResult(values);
                }
                else{
                    lookupItemResult = LookupItemResult
                        .createFailedResult(`The Lookup Item with name "${name}" is not active or does not exist.`);
                }

                return lookupItemResult;
            })
    }
}

class LookupItemResult {
    success: boolean;
    values: Array<any>;
    errorMessage: string;

    static createSuccessResult(values: Array<any>): LookupItemResult {
        const lookupItemResult = new LookupItemResult();
        lookupItemResult.success = true;
        lookupItemResult.errorMessage = "";
        lookupItemResult.values = values;
        return lookupItemResult;
    }

    static createFailedResult(errorMessage: string): LookupItemResult {
        const lookupItemResult = new LookupItemResult();
        lookupItemResult.success = false;
        lookupItemResult.values = [];
        lookupItemResult.errorMessage = errorMessage;
        return lookupItemResult;
    }
}