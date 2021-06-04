import { BaseSelectableComponent } from "./baseSelectableComponent";
import { SelectableItemHtmlService } from '../../_services/selectable-item-html.service';

export class BaseSelectableRangeComponent extends BaseSelectableComponent {
    private decimalNumberRegexString: string = "(0|[1-9]\\d*)(\\.\\d+)?";
    
    metadataCodeRegexp: string =
        `#${this.decimalNumberRegexString}${this.metadataSeparator}${this.decimalNumberRegexString}#`;

    constructor(selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    getMetadata(metaCode: string): any {
        const metadata = metaCode.replace(/#/g, "")
            .split(this.metadataSeparator);
        return {
            minRangeValue: metadata[0],
            maxRangeValue: metadata[1]
        }
    }

    getMetadataCode(metadata: any): string {
        return `#${metadata.minRangeValue}${this.metadataSeparator}${metadata.maxRangeValue}#`;
    }
}