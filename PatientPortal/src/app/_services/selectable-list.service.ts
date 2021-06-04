import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "src/app/_services/config.service";
import { ISearchableByName } from "../_interfaces/iSearchableByName";
import { SelectableList, CategorySelectableList } from "../_models/selectableList";
import { SelectableListConfig } from "../_models/selectableListConfig";
import { SelectableListResult } from "../_models/selectableListResult";
import { ControlDefaultValues } from "../_classes/controlDefaultValues";

@Injectable({ providedIn: "root" })
export class SelectableListService implements ISearchableByName {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByCategoryId(categoryId: string): Promise<SelectableList[]> {
        return this.http.get<SelectableList[]>(`${this.config.apiUrl}selectablelist/category/${categoryId}`)
            .toPromise();
    }

    getByName(name: string, companyId: string): Promise<SelectableList> {
        return this.http.get<SelectableList>(`${this.config.apiUrl}selectablelist/name/${name}/company/${companyId}`)
            .toPromise();
    }

    getSelectableListValues(name: string, companyId: string): Promise<any[]> {
        return this.getByName(name, companyId)
            .then(selectableList => {
                return selectableList && selectableList.jsonValues
                    ? JSON.parse(selectableList.jsonValues).Values
                    : [];
            });
    }

    getSelectableListValuesFromComponent(component: any, selectableListName: string): any[] {
        const selectabelList = component[selectableListName];
        return selectabelList && selectabelList.values && selectabelList.values.length
            ? component[selectableListName].values
            : [];
    }

    getSelectableListDefaultValueFromComponent(component: any, selectableListName: string): string {
        const selectabelList = component[selectableListName];
        return selectabelList && selectabelList.defaultValue && selectabelList.defaultValue.Value
            ? selectabelList.defaultValue.Value
            : ""
    }

    setSelectableListsValuesToComponent(selectableListsConfigs: SelectableListConfig[], component: any): Promise<void> {
        const selectableListPromises = [];

        for (let i = 0; i < selectableListsConfigs.length; i++) {
            const selectabelListConfig = selectableListsConfigs[i];
            const selectabelListName = selectabelListConfig.name;
            const companyId = selectabelListConfig.companyId;

            const selectabelListValuesPromise = this
                .getSelectableListValues(selectabelListName, companyId);

            selectableListPromises.push(selectabelListValuesPromise);
        }

        return Promise.all(selectableListPromises)
            .then(selectableListsValues => {
                for (let i = 0; i < selectableListsValues.length; i++) {
                    const selectableListValues = selectableListsValues[i];
                    const selectableListResult = new SelectableListResult();

                    const selectabelListConfig = selectableListsConfigs[i];

                    const selectabelListName = selectabelListConfig.name;
                    const includeNotSetValue = selectabelListConfig.includeNotSetValue;

                    if (selectableListValues) {
                        const stringValues = selectableListValues.map(s => s.Value)

                        if (includeNotSetValue) {
                            stringValues.push(ControlDefaultValues.selectBox);
                        }

                        const defaultValue = selectableListValues
                            .filter(s => s.IsDefault)[0];

                        selectableListResult.defaultValue = defaultValue;
                        selectableListResult.values = stringValues;
                    }

                    component[selectabelListName] = selectableListResult;
                }
            });
    }

    save(selectableList: SelectableList): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}selectablelist/`, selectableList)
            .toPromise();
    }

    getById(id: string): Promise<SelectableList> {
        return this.http.get<SelectableList>(`${this.config.apiUrl}selectablelist/${id}`)
            .toPromise();
    }

    getByIdWithCatgeoryName(id: string): Promise<CategorySelectableList> {
        return this.http.get<CategorySelectableList>(`${this.config.apiUrl}selectablelist/categoryselectablelist/${id}`)
            .toPromise();
    }

    delete(id: string): Promise<void> {
        return this.http.delete<void>(`${this.config.apiUrl}selectablelist/${id}`)
            .toPromise();
    }
}