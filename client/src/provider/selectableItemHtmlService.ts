import { Injectable } from "@angular/core";
import { DataService } from "./dataService";
import { StringHelper } from "../helpers/stringHelper";
import * as $ from 'jquery';

@Injectable()
export class SelectableItemHtmlService {
    _selectableHtmlElementRegexpFormat: string =
        "<span[\\s]+id[\\s]?=[\\s]?[',\"][a-z,0-9,-]*[',\"][\\s]+metadata[\\s]?=[\\s]?[',\"]{0}[',\"]>[^<]*<\\/span>";
    _selectableHtmlElementFormat: string =
        "<span id='{0}' metadata='{1}'>{2}</span>";

    constructor(protected dataService: DataService) {
    }

    public tryGetSelectableItem(htmlElement: HTMLElement,
        metaCodeRegexpString: string) {
        const selectableItemFailedResult = {
            selectableItem: null,
            success: false
        }
        const tagName = htmlElement.tagName;
        if (tagName !== "SPAN") {
            return selectableItemFailedResult;
        }
        const metadata = htmlElement.getAttribute("metadata");
        if (!metadata || !metadata.match(new RegExp(metaCodeRegexpString))) {
            return selectableItemFailedResult;
        }
        const value = htmlElement.innerText;
        const id = htmlElement.getAttribute("id");

        return {
            selectableItem: new SelectableItem(id, metadata, value),
            success: true
        }
    }

    public getSelectableItems(htmlString: string,
        metaCodeStringRegexps: Array<string>,
        projectionFunc?: (selectableItem: SelectableItem) => any,
        filterFunc?: (selectableItem: SelectableItem) => boolean): Array<any> {
        const selectableItemHtmlElementStrings =
            this.getAllMatchedValues(htmlString, metaCodeStringRegexps);
        if (!selectableItemHtmlElementStrings.length) {
            return [];
        }
        const selectableItems = [];
        for (let i = 0; i < selectableItemHtmlElementStrings.length; i++) {
            const selectableItemHtmlElementString = selectableItemHtmlElementStrings[i];
            const htmlElement = $(selectableItemHtmlElementString)[0];

            const value = htmlElement.innerText;
            const id = htmlElement.getAttribute("id");
            const metadata = htmlElement.getAttribute("metadata");

            const selectableItem = new SelectableItem(id, metadata, value);

            if (filterFunc && !filterFunc(selectableItem)) {
                continue;
            }

            const selectableItemToPush = projectionFunc
                ? projectionFunc(selectableItem)
                : selectableItem;

            selectableItems.push(selectableItemToPush);
        }

        return selectableItems;
    }

    public generateHtmlElementString(metaCode: string): string {
        const id = this.dataService.generateGuid();
        return StringHelper
            .format(this._selectableHtmlElementFormat, id, metaCode, metaCode);
    }

    private getAllMatchedValues(htmlString: string, metaCodeRegexStrings: Array<string>): Array<string> {
        const metadataCodesRegexString = this.getMetadataCodesRegexString(metaCodeRegexStrings);
        const regexString = StringHelper
            .format(this._selectableHtmlElementRegexpFormat, metadataCodesRegexString);
        const regex = new RegExp(regexString, "g");
        const matchedValues = htmlString
            .match(regex);
        return matchedValues ? matchedValues : [];
    }

    private getMetadataCodesRegexString(metaCodeRegexStrings: string[]): any {
        if (metaCodeRegexStrings.length === 1) {
            return metaCodeRegexStrings[0];
        }
        let metaCodeRegexStringsResult = "(";
        for (let i = 0; i < metaCodeRegexStrings.length; i++) {
            const metaCodeRegexString = metaCodeRegexStrings[i];
            metaCodeRegexStringsResult += metaCodeRegexString;
            if (i !== metaCodeRegexStrings.length - 1) {
                metaCodeRegexStringsResult += "|";
            }
        }

        return metaCodeRegexStringsResult += ")";
    }
}

export class SelectableItem {
    id: string;
    metadata: string;
    value: string;

    constructor(id: string, metadata: string, value: string) {
        this.id = id;
        this.metadata = metadata;
        this.value = value;
    }
}