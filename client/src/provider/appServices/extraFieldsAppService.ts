
import { ExtraField } from "../../dataModels/extraField";
import { ExtraFieldDataService } from "../dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { DxDataGridComponent } from "devextreme-angular";
import { ExtraFieldViewDataService } from "../dataServices/read/readDataServices";
import CustomStore from 'devextreme/data/custom_store';
import * as moment from 'moment';
import { Injectable } from "@angular/core";

@Injectable()
export class ExtraFieldsAppService {
    constructor(private extraFieldDataService: ExtraFieldDataService,
        private extraFieldViewDataService: ExtraFieldViewDataService) {
    }

    addExtraColumnsToGridIfNeeded(entityName: string, dataGrid: DxDataGridComponent): void {
        this.loadExtraFields(entityName)
            .then(extraFields => {
                if (extraFields.length) {
                    for (let i = 0; i < extraFields.length; i++) {
                        const extraField = extraFields[i];
                        this.addExtraFieldColumnToGrid(extraField, dataGrid);
                    }
                }
            });
    }

    loadExtraFields(entityName: string): Promise<ExtraField[]> {
        const relatedEntityNameFilter =
            ["RelatedEntityName", "=", entityName];

        const isActiveFilter = ["IsActive", "=", true];
        const showInListFilter = ["ShowInList", "=", true];

        const filter = [
            relatedEntityNameFilter,
            "and",
            isActiveFilter,
            "and",
            showInListFilter
        ];

        const loadOptions = {
            filter: filter
        };

        return this.extraFieldDataService
            .search(loadOptions)
    }

    getExtraFieldValues(entityName: string): Promise<any[]> {
        const relatedEntityNameFilter =
            ["RelatedEntityName", "=", entityName];

        const isActiveFilter = ["IsActive", "=", true];
        const showInListFilter = ["ShowInList", "=", true];

        const filter = [
            relatedEntityNameFilter,
            "and",
            isActiveFilter,
            "and",
            showInListFilter
        ];

        const loadOptions = {
            filter: filter
        };

        return this.extraFieldViewDataService
            .search(loadOptions)
    }

    getExtraFieldDataSource(entityDataService: any, entityName: string, searchColumnId: string,
        postProcessorFunc: Function = null, postProcessorFuncExecutionContext: any = null): CustomStore {
        return new CustomStore({
            byKey: (key) => {
                if (!key) {
                    return Promise.resolve();
                }
                return entityDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const extraFieldValuesPromise = this.getExtraFieldValues(entityName);
                const entityPromise = entityDataService
                    .searchWithCount(loadOptions, searchColumnId)
                    .then(searchEntitiesResult => {
                        if (postProcessorFunc) {
                            searchEntitiesResult.data.forEach(entity => {
                                postProcessorFunc.call(postProcessorFuncExecutionContext, entity);
                            });
                        }

                        return searchEntitiesResult;
                    });

                return Promise.all([extraFieldValuesPromise, entityPromise])
                    .then(result => {
                        const extraFieldValues = result[0];
                        const entitiesSearchResult = result[1];

                        for (let i = 0; i < entitiesSearchResult.data.length; i++) {
                            const entity = entitiesSearchResult.data[i];

                            const extraFieldsById = extraFieldValues
                                .filter(v => {
                                    return v.EntityId === entity[searchColumnId];
                                });

                            if (extraFieldsById.length) {
                                for (let j = 0; j < extraFieldsById.length; j++) {
                                    const entityExtraFieldMap = extraFieldsById[j];
                                    const extraFieldName = entityExtraFieldMap.Name;
                                    let extraFieldValue = entityExtraFieldMap.Value;

                                    if (Date.parse(extraFieldValue)) {
                                        extraFieldValue = moment(extraFieldValue).format("MMM Do YY");
                                    }

                                    entity[extraFieldName] = extraFieldValue;
                                }
                            }
                        }

                        return entitiesSearchResult;
                    });
            }
        });
    }

    private addExtraFieldColumnToGrid(extraField: ExtraField, dataGrid: DxDataGridComponent): void {
        const column = {
            dataField: extraField.Name,
            allowSorting: false,
            allowFiltering: false
        };

        dataGrid.instance.addColumn(column)
    }
}