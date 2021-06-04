import { Injectable } from "@angular/core";
import * as $ from 'jquery';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { SelectableItem } from '../share/classes/selectableItem';

@Injectable({ providedIn: 'root' })
export class SelectableItemHtmlService {
    public tryGetSelectableItem(htmlElement: HTMLElement, metaCodeRegexpString: string) {
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

    public getSelectableItems(htmlString: string, metaCodeStringRegexps: Array<string>,
        projectionFunc?: (selectableItem: SelectableItem) => any,
        filterFunc?: (selectableItem: SelectableItem) => boolean): Array<any> {
        const selectableItemHtmlElementStrings =
            this.getAllSelectableElements(htmlString, metaCodeStringRegexps);
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
        const id = GuidHelper.generateNewGuid();
        return `<span id='${id}' metadata='${metaCode}'>${metaCode}</span>`;
    }

    public wrapBoldTagAroundSelectableElementsValues(htmlString: string, metaCodeRegexStrings: Array<string>): string {
        const regexString = this.getSelectableElementsRegexpString(metaCodeRegexStrings);
        const regex = new RegExp(regexString, "g");

        var formattedHtmlString = htmlString.replace(regex, selectableElement => {
            return this.wrapBoldTagAroundSpanElementValue(selectableElement);
        });

        return formattedHtmlString;
    }

    private wrapBoldTagAroundSpanElementValue(spanElement: string): string {
        const closeSpanTagIndex = spanElement.indexOf(">");
        const firstSpanPart = spanElement.slice(0, closeSpanTagIndex + 1);

        const openSpanTagIndex = spanElement.indexOf("<", 1);
        const spanValue = spanElement.slice(closeSpanTagIndex + 1, openSpanTagIndex);

        const secondSpanPart = spanElement.slice(openSpanTagIndex);

        return `${firstSpanPart}<b>${spanValue}</b>${secondSpanPart}`;
    }

    private getAllSelectableElements(htmlString: string, metaCodeRegexStrings: Array<string>): Array<string> {
        const regexString = this.getSelectableElementsRegexpString(metaCodeRegexStrings);
        const regex = new RegExp(regexString, "g");

        const matchedValues = htmlString
            .match(regex);
        return matchedValues ? matchedValues : [];
    }

    private getSelectableElementsRegexpString(metaCodeRegexStrings: Array<string>): string {
        const metadataCodesRegexString = this.getMetadataCodesRegexString(metaCodeRegexStrings);
        return `<span[\\s]+id[\\s]?=[\\s]?[',\"][a-z,0-9,-]*[',\"][\\s]+metadata[\\s]?=[\\s]?[',\"]${metadataCodesRegexString}[',\"]>[^<]*<\\/span>`;
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