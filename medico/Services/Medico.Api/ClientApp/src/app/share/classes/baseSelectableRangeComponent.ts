import { BaseSelectableComponent } from "./baseSelectableComponent";
import { Constants } from 'src/app/_classes/constants';

export class BaseSelectableRangeComponent extends BaseSelectableComponent {
    get selectableType(): string {
        return Constants.selectableItemTypes.range;
    }

    getMetadata(metaCode: string): any {
        const metadata = metaCode.split(this.metadataSeparator);
        return {
            minRangeValue: metadata[0],
            maxRangeValue: metadata[1]
        }
    }
}