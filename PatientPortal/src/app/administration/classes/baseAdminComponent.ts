import { StateList } from 'src/app/_classes/stateList';
import { MaskList } from 'src/app/_classes/maskList';
import { RegexRuleList } from 'src/app/_classes/regexRuleList';
import { SearchConfiguration } from 'src/app/_classes/searchConfiguration';
import { DxPopupComponent } from 'devextreme-angular';
import { ZipCodeTypeList } from 'src/app/_classes/zipCodeTypeList';

export class BaseAdminComponent {
    states: any[] = StateList.values;
    validationMasks: MaskList = new MaskList();
    regexRuleList: RegexRuleList = new RegexRuleList();
    searchConfiguration: SearchConfiguration = new SearchConfiguration();
    zipCodeTypes: any[] = ZipCodeTypeList.values;

    protected registerEscapeBtnEventHandler(popup: DxPopupComponent) {
        popup.instance.registerKeyHandler("escape", (event) => {
            event.stopPropagation();
        });
    }
}