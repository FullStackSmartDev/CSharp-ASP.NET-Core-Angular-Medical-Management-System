import { BaseSelectableComponent } from "./baseSelectableComponent";
import { SelectableItemHtmlService } from "../../../provider/selectableItemHtmlService";
import { StringHelper } from "../../../helpers/stringHelper";

export class BaseSelectableRangeComponent extends BaseSelectableComponent {
    metadataCodeRegexp: string = "#(0|[1-9]+[0-9]*)\.[1-9]+[0-9]*#";

    constructor(selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    getMetadata(metaCode: string): any {
        const metadata = metaCode.replace(/#/g, "")
            .split(".");
        return {
            minRangeValue: metadata[0],
            maxRangeValue: metadata[1]
        }
    }

    getMetadataCode(metadata: any): string {
        return StringHelper
            .format("#{0}.{1}#", metadata.minRangeValue.toString(),
                metadata.maxRangeValue.toString());
    }
}