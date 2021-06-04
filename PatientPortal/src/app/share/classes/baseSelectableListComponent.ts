import { BaseSelectableComponent } from "./baseSelectableComponent";
import { SelectableItemHtmlService } from '../../_services/selectable-item-html.service';

export class BaseSelectableListComponent extends BaseSelectableComponent {
    metadataCodeRegexp: string = `#[a-z,A-Z,_]+${this.metadataSeparator}[a-z,A-Z,_]+#`;

    constructor(selectableItemHtmlService: SelectableItemHtmlService) {
        super(selectableItemHtmlService);
    }

    getMetadata(metaCode: string) {
        const metadata = metaCode.replace(/#/g, "")
            .split(this.metadataSeparator);
        return {
            categoryName: metadata[0],
            selectableItemName: metadata[1]
        }
    }

    getMetadataCode(metadata: any): string {
        return `#${metadata.categoryName}${this.metadataSeparator}${metadata.selectableItemName}#`;
    }
}