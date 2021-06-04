import { Injectable } from "@angular/core";
import * as $ from 'jquery';
import { SelectableItem } from '../share/classes/selectableItem';
import { Constants } from '../_classes/constants';
import { GuidHelper } from '../_helpers/guid.helper';

@Injectable({ providedIn: 'root' })
export class SelectableItemHtmlService {
    public getSelectableItems(htmlString: string, selectableItemTypes: string[],
        projectionFunc?: (selectableItem: SelectableItem) => any,
        filterFunc?: (selectableItem: SelectableItem) => boolean): Array<any> {

        const selectableItemSelector =
            `${Constants.selectableItem.tagName}[${Constants.selectableItem.attributes.selectableType}]`;

        const container = `<div>${htmlString}</div>`;
        const dom = $.parseHTML(container);

        const selectableItemElements = $(dom)
            .find(selectableItemSelector);

        if (!selectableItemElements || !selectableItemElements.length)
            return [];

        const selectableItems = [];

        for (let i = 0; i < selectableItemElements.length; i++) {
            const htmlElement = selectableItemElements[i];

            const selectableItemType = htmlElement
                .getAttribute(Constants.selectableItem.attributes.selectableType);

            if (selectableItemTypes.indexOf(selectableItemType) === -1)
                continue;

            const value = htmlElement.innerText;
            const id = htmlElement.getAttribute(Constants.selectableItem.attributes.id);
            const metadata = htmlElement.getAttribute(Constants.selectableItem.attributes.metadata);

            const selectableItem = new SelectableItem(id, metadata, value);

            if (filterFunc && !filterFunc(selectableItem))
                continue;

            const selectableItemToPush = projectionFunc
                ? projectionFunc(selectableItem)
                : selectableItem;

            selectableItems.push(selectableItemToPush);
        }

        return selectableItems;
    }

    public wrapBoldTagAroundSelectableElementsValues(htmlString: string): string {
        const selectableItemSelector =
            `${Constants.selectableItem.tagName}[${Constants.selectableItem.attributes.selectableType}]`;

        const containerId = GuidHelper.generateNewGuid();
        const container = `<div id='${containerId}'>${htmlString}</div>`;

        const dom = $.parseHTML(container);

        const selectableItems = $(dom).find(selectableItemSelector);

        if (selectableItems && selectableItems.length) {
            for (let i = 0; i < selectableItems.length; i++) {
                const selectableItem = selectableItems[i];
                selectableItem.innerHTML = `<b>${selectableItem.innerHTML}</b>`;
            }
        }

        return $(dom)[0].innerHTML;
    }
}