import { BaseSelectableComponent } from './baseSelectableComponent';
import { SelectableItem } from './selectableItem';

export interface IPatientSelectableComponent {
    selectableComponent: BaseSelectableComponent;

    selectableItem: SelectableItem;

    isPreviewMode: boolean;

    visible: boolean;

    getSelecatbleItems(htmlContent: string): Promise<SelectableItem[]>;
}