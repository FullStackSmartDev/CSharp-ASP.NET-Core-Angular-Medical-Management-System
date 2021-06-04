import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';

export abstract class BaseSelectableComponent {
    constructor(protected selectableItemHtmlService: SelectableItemHtmlService) {
    }

    protected metadataSeparator: string = "::";

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