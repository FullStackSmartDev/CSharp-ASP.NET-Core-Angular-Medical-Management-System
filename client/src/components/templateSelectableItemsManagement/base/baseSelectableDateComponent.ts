import { BaseSelectableComponent } from "./baseSelectableComponent";
import { SelectableItemHtmlService } from "../../../provider/selectableItemHtmlService";
import { StringHelper } from "../../../helpers/stringHelper";

export class BaseSelectableDateComponent extends BaseSelectableComponent {
    metadataCodeRegexp: string = "#([y, Y]{4}|[m, M]{2}\\/[y, Y]{4}|[m, M]{2}\\/[d, D]{2}\\/[y, Y]{4})#";

    dateFormats: Array<any> = [
        {
            id: 1,
            displayName: "Year",
            format: "YYYY",
            regex:"[1, 2]{1}[0-9]{3}"
        },
        {
            id: 2,
            displayName: "Month and Year",
            format: "MM/YYYY",
            regex:"(0[1-9]|1[0-2])\/[1, 2]{1}[0-9]{3}"
        },
        {
            id: 3,
            displayName: "Full Date",
            format: "MM/DD/YYYY",
            regex: "(0[1-9]|1[0-2])\/(0[1-9]|[1,2][0-9]|3[0,1])\/[1, 2]{1}[0-9]{3}"
        }
    ]

    constructor(selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    getMetadata(metaCode: string): any {
        return metaCode.replace(/#/g, "");
    }

    getMetadataCode(dateFromat: string): string {
        return StringHelper
            .format("#{0}#", dateFromat);
    }
}