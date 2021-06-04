import { BaseSelectableComponent } from "./baseSelectableComponent";
import { Constants } from 'src/app/_classes/constants';

export class BaseSelectableListComponent extends BaseSelectableComponent {
    get selectableType(): string {
        return Constants.selectableItemTypes.list;
    }

    getMetadata(metaCode: string) {
        return metaCode;
    }
}