import { Output, Component, EventEmitter, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DxLookupComponent } from 'devextreme-angular';
import { ApplicationConfigurationService } from '../../../provider/applicationConfigurationService';
import { TemplateTypeDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { LookupDataSourceProvider } from '../../../provider/lookupDataSourceProvider';

@Component({
    templateUrl: 'templateTypeLookupComponent.html',
    selector: 'template-type-lookup'
})
export class TemplateTypeLookupComponent {
    @Output() onTemplateTypeChanged: EventEmitter<string>
        = new EventEmitter();

    @ViewChild("dxLookup") dxLookup: DxLookupComponent;

    templateTypeDataSource: any = {};

    constructor(private templateTypeDataService: TemplateTypeDataService,
        private lookupDataSourceProvider: LookupDataSourceProvider) {
        this.initDataSource()
    }

    initDataSource(): any {
        this.templateTypeDataSource.store =
            this.lookupDataSourceProvider.templateTypeLookupDataSource;
    }

    templateTypeChanged($event) {
        const templateTypeId = $event.value;
        if (!templateTypeId) {
            return;
        }

        this.onTemplateTypeChanged.next(templateTypeId);
        this.dxLookup.instance.reset();
    }
}