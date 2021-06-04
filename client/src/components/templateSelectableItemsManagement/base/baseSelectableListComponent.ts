import { BaseSelectableComponent } from "./baseSelectableComponent";
import { SelectableItemHtmlService } from "../../../provider/selectableItemHtmlService";
import { StringHelper } from "../../../helpers/stringHelper";

export class BaseSelectableListComponent extends BaseSelectableComponent {
    metadataCodeRegexp: string = "#[a-z,A-Z,_]+\\.[a-z,A-Z,_]+#";

    constructor(selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    getMetadata(metaCode: string) {
        const metadata = metaCode.replace(/#/g, "")
            .split(".");
        return {
            categoryName: metadata[0],
            selectableItemName: metadata[1]
        }
    }
    
    getMetadataCode(metadata: any): string {
        return StringHelper
            .format("#{0}.{1}#", metadata.categoryName, metadata.selectableItemName);
    }
}