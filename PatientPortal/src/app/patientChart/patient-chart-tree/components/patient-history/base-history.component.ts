import { StateList } from 'src/app/_classes/stateList';
import { MaskList } from 'src/app/_classes/maskList';
import { RegexRuleList } from 'src/app/_classes/regexRuleList';
import { SearchConfiguration } from 'src/app/_classes/searchConfiguration';
import { DxPopupComponent } from 'devextreme-angular';
import { DefaultValueService } from 'src/app/_services/default-value.service';
import { PopupConfiguration } from 'src/app/_classes/popupConfiguration';

export class BaseHistoryComponent {
    states: any[] = StateList.values;
    validationMasks: MaskList = new MaskList();
    regexRuleList: RegexRuleList = new RegexRuleList();
    searchConfiguration: SearchConfiguration = new SearchConfiguration();
    popupConfiguration: PopupConfiguration = new PopupConfiguration();
    defaultHistoryValue: string = "";

    protected constructor(private defaultValueService: DefaultValueService) {

    }

    protected registerEscapeBtnEventHandler(popup: DxPopupComponent): void {
        popup.instance.registerKeyHandler("escape", (event) => {
            event.stopPropagation();
        });
    }

    protected initDefaultHistoryValue(historyName: string): void {
        this.defaultValueService.getByKeyName(historyName)
            .then(defaultHistoryValue => {
                this.defaultHistoryValue = defaultHistoryValue.value
                    ? defaultHistoryValue.value
                    : "";
            })
    }
}