import { SelectableItemHtmlService } from "../../../provider/selectableItemHtmlService";

export abstract class BaseSelectableComponent {
    constructor(protected selectableItemHtmlService: SelectableItemHtmlService) {
    }

    abstract get metadataCodeRegexp(): string;

    abstract getMetadata(metaCode: string): any;

    abstract getMetadataCode(metadata: any): string;


    public getHtmlElementString(metadata: any): string {
        const metaCode =
            this.getMetadataCode(metadata);
        return this.selectableItemHtmlService
            .generateHtmlElementString(metaCode)
    }

    public tryGetSelectableItem(htmlElement: HTMLElement): any {
        return this.selectableItemHtmlService
            .tryGetSelectableItem(htmlElement, this.metadataCodeRegexp);
    }
}