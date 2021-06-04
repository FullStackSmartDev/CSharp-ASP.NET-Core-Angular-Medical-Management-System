import { BaseSelectableComponent } from "./baseSelectableComponent";
import { Constants } from 'src/app/_classes/constants';

export class BaseSelectableDateComponent extends BaseSelectableComponent {
    dateFormats: Array<any> = [
        {
            id: 1,
            displayName: "Year",
            format: "yyyy",
            regex: "[1, 2]{1}[0-9]{3}"
        },
        {
            id: 2,
            displayName: "Month and Year",
            format: "MM/yyyy",
            regex: "(0[1-9]|1[0-2])\/[1, 2]{1}[0-9]{3}"
        },
        {
            id: 3,
            displayName: "Full Date",
            format: "MM/dd/yyyy",
            regex: "(0[1-9]|1[0-2])\/(0[1-9]|[1,2][0-9]|3[0,1])\/[1, 2]{1}[0-9]{3}"
        }
    ];

    get selectableType(): string {
        return Constants.selectableItemTypes.date;
    }

    getMetadata(metaCode: string): any {
        return metaCode;
    }
}