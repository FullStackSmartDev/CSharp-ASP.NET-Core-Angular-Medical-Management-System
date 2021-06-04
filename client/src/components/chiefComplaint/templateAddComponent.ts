import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { DxLookupComponent } from 'devextreme-angular';
import { LoadPanelService } from '../../provider/loadPanelService';
import { TemplateDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { TemplateTypeIds } from '../../constants/templateType';
import CustomStore from 'devextreme/data/custom_store';
import { ApplicationConfigurationService } from '../../provider/applicationConfigurationService';

@Component({
    templateUrl: 'templateAddComponent.html',
    selector: 'template-add'
})

export class TemplateAddComponent implements OnInit {
    @Input("templateTypeId") templateTypeId;

    @Output() onTemplateAdded: EventEmitter<any>
        = new EventEmitter();

    @ViewChild("templateLookup") templateLookup: DxLookupComponent;

    applicationConfiguration = ApplicationConfigurationService;

    template: any = {};

    templateDataSource: any = {};

    get placeholderMessage(): string {
        let templateTypeName = "";
        switch (this.templateTypeId) {
            case TemplateTypeIds.hpi:
                templateTypeName = "HPI";
                break;
            case TemplateTypeIds.ros:
                templateTypeName = "ROS";
                break;
            case TemplateTypeIds.pe:
                templateTypeName = "PE";
                break;
            default:
                break;
        }

        return `Select ${templateTypeName} templates`;
    }

    constructor(private loadPanelService: LoadPanelService,
        private templateDataService: TemplateDataService) {

    }

    ngOnInit(): void {
        this.initTemplateDataSource();
    }

    addTemplate() {
        this.templateLookup
            .instance
            .reset();
        this.onTemplateAdded.next(this.template);
        this.template = {};
    }

    templateChanged($event) {
        const templateId = $event.value;
        if (!templateId) {
            return;
        }
        this.loadPanelService.showLoader();

        this.templateDataService.getById(templateId)
            .then(template => {
                if (template)
                    this.template = template;

                this.loadPanelService.hideLoader();
            })
    }

    private initTemplateDataSource(): any {
        this.templateDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve()
                return this.templateDataService.getById(key);
            },
            load: (loadOptions: any) => {
                const requestedFields = ["Id", "Title", "ReportTitle", "TemplateTypeId"];

                const templateTypeFilter = ["TemplateTypeId", "=", this.templateTypeId];

                loadOptions.filter = templateTypeFilter;

                const takeItemCount = this.applicationConfiguration
                    .defaultPageSizeCount
                loadOptions.take = takeItemCount;

                const searchExpr = loadOptions.searchExpr;
                const searchOperation = loadOptions.searchOperation;
                const searchValue = loadOptions.searchValue;

                if (searchExpr && searchOperation && searchValue) {
                    loadOptions.filter = [
                        templateTypeFilter,
                        "and",
                        [searchExpr, searchOperation, searchValue]
                    ];
                }

                return this.templateDataService
                    .search(loadOptions, requestedFields);
            }
        });
    }
}
