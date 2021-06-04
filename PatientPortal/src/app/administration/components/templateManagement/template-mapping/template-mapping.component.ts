import { Component, Input, ViewChild } from "@angular/core";
import { BaseAdminComponent } from 'src/app/administration/classes/baseAdminComponent';
import { ChiefComplaint } from 'src/app/_models/chiefComplaint';
import { DxDataGridComponent } from 'devextreme-angular';
import { AlertService } from 'src/app/_services/alert.service';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { ChiefComplaintService } from 'src/app/_services/chief-complaint.service';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';

@Component({
    selector: "template-mapping",
    templateUrl: "./template-mapping.component.html"
})
export class TemplateMappingComponent extends BaseAdminComponent {
    @ViewChild("mappingDataGrid", { static: false }) mappingDataGrid: DxDataGridComponent;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    mapping: any = {
        chiefComplaint: new ChiefComplaint()
    }

    selectedMappings: any[] = [];

    isMappingPopupOpened: boolean = false;

    mappingDataSource: any = {};

    isNewMapping: boolean = true;

    constructor(private chiefComplaintService: ChiefComplaintService,
        private alertService: AlertService,
        private dxDataUrlService: DxDataUrlService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService) {
        super();

        this.init()
    }

    ngOnInit(): void {
        this.subscribeToCompanyIdChanges();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    onTemplateKeywordMappingSaved() {
        this.onMappingPopupHidden();
        this.mappingDataGrid.instance.refresh();
    }

    deleteMapping(mapping, $event) {
        $event.stopPropagation();

        const chiefComplaintId = mapping.id;

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the mapping ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {

                this.chiefComplaintService.delete(chiefComplaintId)
                    .then(() => {
                        this.mappingDataGrid.instance.refresh();
                    })
                    .catch(error => this.alertService.error(error.message ? error.message : error));

            }
        });
    }

    onMappingSelected($event) {
        const selectedChiefComplaint = $event.selectedRowsData[0];
        if (!selectedChiefComplaint) {
            return;
        }

        const selectedChiefComplaintId = $event.selectedRowsData[0].id;
        this.chiefComplaintService.getById(selectedChiefComplaintId)
            .then((chiefComplaint) => {
                this.mapping.chiefComplaint = chiefComplaint;
                this.isNewMapping = false;
                this.isMappingPopupOpened = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }

    openMappingForm() {
        this.isMappingPopupOpened = true;
    }

    onMappingPopupHidden(): void {
        this.resetMappingForm();
        this.isMappingPopupOpened = false;
    }

    private init() {
        this.initMappingDataSource();
    }

    private initMappingDataSource() {
        this.mappingDataSource.store = createStore({
            loadParams: { isDxGridData: true },
            loadUrl: this.dxDataUrlService.getGridUrl("chiefcomplaint"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private resetMappingForm() {
        this.mapping = {
            chiefComplaint: new ChiefComplaint()
        };

        this.isNewMapping = true;
        this.selectedMappings = [];
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;
                    if (this.mappingDataGrid && this.mappingDataGrid.instance)
                        this.mappingDataGrid.instance.refresh();
                }
            });
    }
}