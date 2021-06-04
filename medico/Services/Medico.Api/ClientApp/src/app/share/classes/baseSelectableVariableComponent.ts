import { BaseSelectableComponent } from "./baseSelectableComponent";
import { Constants } from 'src/app/_classes/constants';

export class BaseSelectableVariableComponent extends BaseSelectableComponent {
    get selectableType(): string {
        return Constants.selectableItemTypes.variable;
    }

    getMetadata(metaCode: string): any {
        const metadata = metaCode.split(this.metadataSeparator);
        return {
            variableName: metadata[0],
            variableType: +metadata[1]
        }
    }
}