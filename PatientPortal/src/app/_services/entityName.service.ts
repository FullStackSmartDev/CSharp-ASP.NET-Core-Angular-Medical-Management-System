import { Injectable } from '@angular/core';
import { StringHelper } from 'src/app/_helpers/string.helper';
import { ISearchableByName } from '../_interfaces/iSearchableByName';

@Injectable({ providedIn: 'root' })
export class EntityNameService {
    tryGetUniqueNameForEntityRecord(readableEntityName: string,
        searchableByNameDataSource: ISearchableByName, companyId: string): Promise<EntityNameCreationResult> {

        const entityNameCheckers =
            this.getEntityNameChekers(searchableByNameDataSource);

        const newlyGeneratedRecordName = this
            .formatFromReadableEntityName(readableEntityName);

        const chekResultsPromises =
            entityNameCheckers.map(enc => enc.check(newlyGeneratedRecordName, companyId));

        return Promise.all(chekResultsPromises)
            .then(results => {
                const failedCheckResults =
                    results.filter(r => !r.success);

                if (failedCheckResults.length) {
                    const errorMessages = failedCheckResults.length === 1 ?
                        failedCheckResults[0].errorMessage
                        : failedCheckResults
                            .map(fcr => fcr.errorMessage)
                            .join("\n\n");

                    return new EntityNameCreationResult(false, errorMessages, null)
                }

                return new EntityNameCreationResult(true, null, newlyGeneratedRecordName);
            })
    }

    getEntityNameChekers(searchableSource: ISearchableByName): Array<IEntityNameCheker> {
        return [
            new AlreadyExistedNameChecker(searchableSource),
            new UnsupportedCharsNameChecker()
        ];
    }

    formatFromReadableEntityName(readableEntityName: string): string {
        return StringHelper.camelize(readableEntityName);
    }
}

interface IEntityNameCheker {
    check(name: string, companyId: string): Promise<EntityNameCheckResult>;
}

class AlreadyExistedNameChecker implements IEntityNameCheker {
    private _searchableByNameSource: ISearchableByName;

    constructor(searchableByNameSource: ISearchableByName) {
        this._searchableByNameSource = searchableByNameSource;
    }

    check(name: string, companyId: string): Promise<EntityNameCheckResult> {
        return this._searchableByNameSource
            .getByName(name, companyId)
            .then(record => {
                if (!record) {
                    return new EntityNameCheckResult();
                }
                else {
                    return new EntityNameCheckResult(false,
                        `Unique name for record is generated automatically
                        based on readable title. It provides us possibility of having references
                        to records in application. Try to use another title`);
                }
            });
    }
}

class UnsupportedCharsNameChecker implements IEntityNameCheker {
    private _availableCharsRegex: RegExp = /^[a-zA-Z_]+$/;

    check(name: string): Promise<EntityNameCheckResult> {
        if (!name.match(this._availableCharsRegex)) {
            const entityNameCheckResult =
                new EntityNameCheckResult(false, "You tried to use unsupported symbols. Please, use a-z, A-Z, _");
            return Promise.resolve(entityNameCheckResult);
        }

        return Promise.resolve(new EntityNameCheckResult());
    }
}

class EntityNameCheckResult {
    success: boolean;
    errorMessage: string;

    constructor(success: boolean = true, errorMessage: string = null) {
        this.success = success;
        this.errorMessage = errorMessage;
    }
}

class EntityNameCreationResult extends EntityNameCheckResult {
    success: boolean;
    generatedName: string;
    errorMessage: string;

    constructor(success: boolean, errorMessage: string, generatedName: string) {
        super(success, errorMessage);
        this.generatedName = generatedName;
    }
}