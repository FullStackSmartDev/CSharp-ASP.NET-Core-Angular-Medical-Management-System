import { Injectable } from "@angular/core";
import { SelectableListConfig } from "../_models/selectableListConfig";
import { SelectableListResult } from "../_models/selectableListResult";
import { ControlDefaultValues } from "../_classes/controlDefaultValues";
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { BaseSelectableListService } from './base-selectable-list.service';
import { SelectableListSearchFilter } from '../administration/models/selectableListSearchFilter';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: "root" })
export class SelectableListService extends BaseSelectableListService {
    baseSelectableListUrl: string = ApiBaseUrls.selectableList;

    constructor(http: HttpClient, config: ConfigService) {
        super(http, config);
    }

    importLibrarySelectableLists(companyId: string,
        categoryId: string, selectedListsIds: string[]) {

        const patchObject = [];

        patchObject.push({
            "op": "add",
            "path": "/companyId",
            "value": companyId
        });

        patchObject.push({
            "op": "add",
            "path": "/libraryCategoryId",
            "value": categoryId
        });

        for (let i = 0; i < selectedListsIds.length; i++) {
            const libraryListId = selectedListsIds[i];
            patchObject.push({
                "op": "add",
                "path": "/libraryEntityIds/-",
                "value": libraryListId
            });
        }

        return this.http.patch(`${this.config.apiUrl}${this.baseSelectableListUrl}/imported-lists`, patchObject)
            .toPromise();
    }

    syncWithSelectableListTemplate(id: string, version: number | null) {
        const patchObject = [];

        if (!version)
            version = 1;

        patchObject.push({
            "op": "add",
            "path": "/version",
            "value": version
        });

        return this.http.patch(`${this.config.apiUrl}${this.baseSelectableListUrl}/${id}/version`, patchObject)
            .toPromise();
    }

    getSelectableListDefaultValueFromComponent(component: any, selectableListName: string): string {
        const selectabelList: SelectableListResult = component[selectableListName];
        return selectabelList && selectabelList.defaultValue
            ? selectabelList.defaultValue
            : ""
    }

    getSelectableListValuesFromComponent(component: any, selectableListName: string): any[] {
        const selectabelList = component[selectableListName];
        return selectabelList && selectabelList.values && selectabelList.values.length
            ? component[selectableListName].values
            : [];
    }

    setSelectableListsValuesToComponent(selectableListsConfigs: SelectableListConfig[], component: any): Promise<void> {
        const companyId = selectableListsConfigs[0].companyId;

        const filter = new SelectableListSearchFilter();
        filter.companyId = companyId;
        filter.librarySelectableListIds = selectableListsConfigs
            .map(c => c.librarySelectableListId);

        return this.getByFilter(filter)
            .then(selectableLists => {
                for (let i = 0; i < selectableLists.length; i++) {
                    const selectableList = selectableLists[i];
                    const librarySelectableListId = selectableList.librarySelectableListId;

                    const selectableListResult = new SelectableListResult();

                    const selectabelListConfig = selectableListsConfigs
                        .find(c => c.librarySelectableListId === librarySelectableListId);

                    const selectabelListName = selectabelListConfig.name;
                    const includeNotSetValue = selectabelListConfig.includeNotSetValue;

                    const selectableListValues = selectableList.selectableListValues;

                    if (selectableListValues.length) {
                        const stringValues = selectableListValues.map(s => s.value)

                        if (includeNotSetValue) {
                            stringValues.push(ControlDefaultValues.selectBox);
                        }

                        const defaultSelectableListValue = selectableListValues
                            .find(s => s.isDefault);
                            
                        //every selectable list has to have default value
                        //todo: create patcher to set default value for selectable list if doesn't exist
                        selectableListResult.defaultValue = defaultSelectableListValue
                            ? defaultSelectableListValue.value
                            : selectableListValues[0].value;

                        selectableListResult.values = stringValues;
                    }

                    component[selectabelListName] = selectableListResult;
                }
            });
    }
}