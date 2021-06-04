import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit } from "@angular/core";
import { ExtraField } from "../../dataModels/extraField";
import { EntityExtraFieldMap } from "../../dataModels/entityExtraFieldMap";
import { ExtraFieldDataService, EntityExtraFieldMapDataService } from "../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { ExtraFieldType } from "../../enums/extraFieldType";
import { SqlValuesProvider } from "../../provider/sqlDataSource/sqlQueryStringProviders/sqlValuesProvider";

@Component({
    templateUrl: 'extraFieldsTabComponent.html',
    selector: 'extra-fields-tab'
})

export class ExtraFieldsTabComponent implements AfterViewInit {
    @Input("entityName") entityName: string;
    @Input("entityModel") entityModel: any;

    @Output() onExtraFieldsTabCreated: EventEmitter<any>
        = new EventEmitter();

    extraFieldsMetadata: ExtraField[] = [];
    extraFieldValues: EntityExtraFieldMap[] = [];

    get areActiveExtraFieldsExist(): boolean {
        return !!this.extraFieldsMetadata.length;
    }

    constructor(private extraFieldDataService: ExtraFieldDataService,
        private entityExtraFieldMapDataService: EntityExtraFieldMapDataService,
        private sqlValuesProvider: SqlValuesProvider) {

    }

    ngAfterViewInit(): void {
        this.updateExtraFields(this.entityModel.Id, this.entityName);
    }

    updateExtraFields(entityModelId: string, entityName: string): void {
        this.getExtraFieldsData(entityModelId, entityName)
            .then(extraFieldsData => {
                const extraFieldsMetadata = extraFieldsData[0];
                if (extraFieldsMetadata.length) {
                    this.extraFieldsMetadata = extraFieldsMetadata;
                }

                const extraFieldsValues = extraFieldsData[1];
                if (extraFieldsValues.length) {
                    this.extraFieldValues = extraFieldsValues;
                }

                this.createExtraFieldsTabIfNeeded();
            });
    }

    saveExtraFields(): Promise<any> {
        const createUpdatePromises = [];

        for (let i = 0; i < this.extraFieldsMetadata.length; i++) {
            const extraFieldMetadata = this.extraFieldsMetadata[i];

            const extraFieldMetadataId = extraFieldMetadata.Id;
            const extraFieldMetadataName = extraFieldMetadata.Name;

            const entityExtraFieldMap = this.extraFieldValues.filter(e => {
                return e.EntityId === this.entityModel.Id && e.ExtraFieldId === extraFieldMetadataId;
            })[0];

            const extraFieldValue =
                this.entityModel[extraFieldMetadataName];

            if (!extraFieldValue) {
                continue;
            }

            const extraFieldStringValue = this.sqlValuesProvider
                .getSqlValue(extraFieldValue).originalStringValue;

            if (entityExtraFieldMap) {
                entityExtraFieldMap.Value = extraFieldStringValue;

                const entityExtraFieldMapFilter = [
                    ["ExtraFieldId", "=", extraFieldMetadataId],
                    "and",
                    ["EntityId", "=", this.entityModel.Id]
                ]

                const updatePromise = this.entityExtraFieldMapDataService
                    .update(entityExtraFieldMap, entityExtraFieldMapFilter);

                createUpdatePromises.push(updatePromise);
            }
            else {
                const newEntityExtraFieldMap = new EntityExtraFieldMap();

                newEntityExtraFieldMap.EntityId = this.entityModel.Id;
                newEntityExtraFieldMap.ExtraFieldId = extraFieldMetadata.Id;
                newEntityExtraFieldMap.Value = extraFieldStringValue;

                const createPromise = this.entityExtraFieldMapDataService
                    .create(newEntityExtraFieldMap);

                createUpdatePromises.push(createPromise);
            }
        }

        return Promise.all(createUpdatePromises);
    }

    private createExtraFieldsTabIfNeeded(): void {
        if (this.extraFieldsMetadata.length) {
            const extraFieldsTab = this.createExtraFieldsTab();

            this.onExtraFieldsTabCreated.next(extraFieldsTab);
        }
    }

    private createExtraFieldsTab(): any {
        const extraFieldsTab = {
            title: "Additional Info",
            colCount: 2,
            items: []
        }

        extraFieldsTab.items =
            this.getExtraFields();

        return extraFieldsTab;
    }

    private getExtraFields(): any[] {
        const extraFields = [];

        for (let i = 0; i < this.extraFieldsMetadata.length; i++) {
            const extraFieldMetadata = this.extraFieldsMetadata[i];
            const extraFieldType = extraFieldMetadata.Type;

            let extraField = {
                dataField: "",
                editorType: ""
            };

            switch (extraFieldType) {
                case ExtraFieldType.TextBox:
                    extraField.editorType = "dxTextBox";
                    break;
                case ExtraFieldType.DatePicker:
                    extraField.editorType = "dxDateBox";
                    break;
                case ExtraFieldType.NumberBox:
                    extraField.editorType = "dxNumberBox";
                    break;
            }

            extraField.dataField = extraFieldMetadata.Name;
            this.setExtraFieldValueIfNeeded(extraFieldMetadata.Id, extraFieldMetadata.Name);

            extraFields.push(extraField);
        }

        return extraFields;
    }

    private setExtraFieldValueIfNeeded(extraFieldId: string, extraFieldName: string): void {
        if (this.extraFieldValues.length) {
            const extraFieldEntityMap = this.extraFieldValues.filter(f => f.ExtraFieldId === extraFieldId)[0];
            if (extraFieldEntityMap) {
                this.entityModel[extraFieldName] = extraFieldEntityMap.Value;
            }
        }
    }

    private getExtraFieldsData(entityId: string, entityName: string): Promise<any[]> {
        const extraFieldsMetadataPromise =
            this.getEntityExtraFieldsMetadata(entityName);

        const extraFieldsValuesPromise =
            this.getEntityExtraFieldsValues(entityId);

        return Promise
            .all([extraFieldsMetadataPromise, extraFieldsValuesPromise]);
    }

    private getEntityExtraFieldsValues(entityId: string): Promise<EntityExtraFieldMap[]> {
        if (!entityId) {
            return Promise.resolve([]);
        }

        const entityIdFilter =
            ["EntityId", "=", entityId];

        const loadOptions = {
            filter: entityIdFilter
        }

        return this.entityExtraFieldMapDataService
            .search(loadOptions);

    }

    private getEntityExtraFieldsMetadata(entityName: string): Promise<ExtraField[]> {
        const relatedEntityNameFilter =
            ["RelatedEntityName", "=", entityName];

        const isActiveFilter = ["IsActive", "=", true];

        const filter = [
            relatedEntityNameFilter,
            "and",
            isActiveFilter
        ];

        const loadOptions = {
            filter: filter
        };

        return this.extraFieldDataService
            .search(loadOptions)
    }
}