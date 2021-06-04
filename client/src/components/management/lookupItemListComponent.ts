import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GuidHelper } from '../../helpers/guidHelper';

@Component({
    templateUrl: 'lookupItemListComponent.html',
    selector: 'lookup-item-list'
})

export class LookupItemListComponent {
    @Input("lookupItemListJsonString")
    set lookupItemListJsonString(lookupItemListJsonString: string) {
        this.lookupItemList =
            JSON.parse(lookupItemListJsonString).Values;

        this.preProcessLookupItems();
    };
    @Output("onLookupItemListChanged") onLookupItemListChanged: EventEmitter<string>
        = new EventEmitter();

    lookupItemList: Array<LookupItem>;

    constructor() {
        this.validateLookupItemValue =
            this.validateLookupItemValue.bind(this);
    }

    onLookupItemRemoved($event) {
        const lookupItemIdToRemove = $event.data.Id;

        let index = -1;
        for (let i = 0; i < this.lookupItemList.length; i++) {
            const lookupItem = this.lookupItemList[i];
            if (lookupItem.Id === lookupItemIdToRemove) {
                index = i;
            }
        }

        if (index !== -1) {
            this.lookupItemList.splice(index, 1);
        }

        this.updatelookupItemListJsonString();
    }

    validateLookupItemValue(params) {
        const lookupItemValue = params.value;
        const lookupItemWithSameValue = this.lookupItemList
            .filter(l => l.Value === lookupItemValue)[0];
        if (!lookupItemWithSameValue) {
            return true;
        }

        return !lookupItemWithSameValue ? true : lookupItemWithSameValue.Id === params.data.Id;
    }

    onInitNewLookupItem($event) {
        $event.data =
            new LookupItem();
    }

    onLookupItemInserting($event) {
        const id = $event.key;
        const lookupItemData =
            $event.data;

        const lookupItem =
            new LookupItem();

        lookupItem.IsDefault = !!lookupItemData.IsDefault;

        if (lookupItem.IsDefault) {
            this.changeIsDefaultPropertyIfNeeded(id);
        }

        lookupItem.Value = lookupItemData.Value;
        lookupItem.Description = lookupItemData.Description || lookupItemData.Value;

        $event.data = lookupItem;
    }

    onLookupItemInserted() {
        this.updatelookupItemListJsonString();
    }

    onLookupItemUpdated($event) {
        const id = $event.key.Id;
        const changedLookupItem =
            this.lookupItemList.filter(li => li.Id === id)[0];

        const changedData = $event.data;
        const isDefault = changedData.IsDefault;

        for (let prop in changedData) {
            if (changedData.hasOwnProperty(prop)) {
                changedLookupItem[prop] = changedData[prop];
            }
        }

        if (isDefault) {
            this.changeIsDefaultPropertyIfNeeded(id);
        }

        this.updatelookupItemListJsonString();
    }

    private changeIsDefaultPropertyIfNeeded(changedLookupItemId: string): any {
        const defualtLookupItem =
            this.lookupItemList.filter(li => li.IsDefault && li.Id !== changedLookupItemId)[0];

        if (defualtLookupItem) {
            defualtLookupItem.IsDefault = false;
        }
    }

    private updatelookupItemListJsonString(): any {
        const lookupItemList = [];
        this.lookupItemList.forEach(li => {
            const lookupItem = {
                Id: li.Id,
                Value: li.Value,
                Description: li.Description,
            }

            if (li.IsDefault) {
                lookupItem["IsDefault"] = true;
            }

            lookupItemList.push(lookupItem);
        });

        this.onLookupItemListChanged
            .next(JSON.stringify({
                Values: lookupItemList
            }));
    }

    private preProcessLookupItems(): any {
        this.lookupItemList.forEach(l => {
            l.IsDefault = !!l.IsDefault;
        });
    }
}

class LookupItem {
    Id: string;
    Value: string;
    IsDefault: boolean;
    Description: string;

    constructor() {
        this.Id = GuidHelper.generateNewGuid();
        this.Value = "";
        this.Description = "";
        this.IsDefault = false;
    }

    createFromEntityModel(entity: any) {
        const newLookupItem
            = new LookupItem();

        newLookupItem.Description = entity.Description;
        newLookupItem.Value = entity.Value;
        newLookupItem.IsDefault = !!entity.IsDefault;

        return newLookupItem;
    }
}