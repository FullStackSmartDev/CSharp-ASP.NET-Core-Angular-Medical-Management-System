import { Component, ViewChild, Input, OnInit, AfterViewInit } from '@angular/core';
import { DxDataGridComponent, DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { BaseComponent } from '../../baseComponent';
import { Addendum } from '../../../dataModels/addendum';
import { DataService } from '../../../provider/dataService';
import { ToastService } from '../../../provider/toastService';
import { LoadPanelService } from '../../../provider/loadPanelService';
import { AddendumDataService } from '../../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import CustomStore from 'devextreme/data/custom_store';
import { ArrayHelper } from '../../../helpers/arrayHelper';

@Component({
    templateUrl: 'addendumComponent.html',
    selector: 'addendum'
})

export class AddendumComponent extends BaseComponent implements OnInit, AfterViewInit {
    @Input("admissionId") admissionId: string;

    @ViewChild("addendumDataGrid") addendumDataGrid: DxDataGridComponent;
    @ViewChild("addendumCreationForm") addendumCreationForm: DxFormComponent;
    @ViewChild("createUpdateAddendumPopup") createUpdateAddendumPopup: DxPopupComponent;

    addendumDataSource: any = {};

    addendum: Addendum;

    selectedAddendums: Array<any> = [];

    isCreateUpdatePopupOpened: boolean = false;

    isNewAddendum: boolean = true;

    constructor(dataService: DataService, toastService: ToastService,
        private loadPanelService: LoadPanelService,
        private addendumDataService: AddendumDataService) {
        super(dataService, toastService);
    }

    openCreateAddendumForm() {
        this.isNewAddendum = true;
        this.isCreateUpdatePopupOpened = true;
    }

    onCreateUpdatePopupHidden() {
        this.resetCreateUpdateAddendumForm();
    }

    private resetCreateUpdateAddendumForm() {
        this.isNewAddendum = true;
        this.selectedAddendums = [];
        this.addendum = new Addendum();
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        this.createUpdateAddendumPopup
            .instance.registerKeyHandler("escape", (event) => {
                event.stopPropagation();
            });
    }

    onAddendumSelected($event) {
        const addendum = $event.selectedRowsData[0];
        if (!addendum)
            return;

        this.loadPanelService
            .showLoader();

        const addendumId = addendum.Id;

        this.addendumDataService.getById(addendumId)
            .then(addendum => {
                this.isNewAddendum = false;
                this.addendum = addendum;
                this.isCreateUpdatePopupOpened = true;

                this.loadPanelService
                    .hideLoader();
            })
            .catch(error => {
                this.loadPanelService
                    .hideLoader();

                this.toastService
                    .showErrorMessage(`Error ${error.message ? error.message : error}`);
            });
    }

    deleteAddendum($event, addendumId: string) {
        $event.event.stopPropagation();
        this.loadPanelService.showLoader();

        const loadOptions = {
            filter: ["Id", "=", addendumId]
        }

        this.addendumDataService
            .firstOrDefault(loadOptions)
            .then(addendum => {
                const filter = `WHERE Id = '${addendumId}'`;

                this.addendumDataService.delete(filter, addendum)
                    .then(() => {
                        this.addendumDataGrid
                            .instance.refresh();
                            
                        this.loadPanelService
                            .hideLoader();
                    });
            })
    }

    createUpdateAddendum() {
        const validationResult = this.addendumCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        if (this.isNewAddendum) {
            this.addendum.AdmissionId = this.admissionId;
        }

        this.addendum
            .convertToEntityModel();

        const createUpdatePromise = this.isNewAddendum
            ? this.addendumDataService.create(this.addendum)
            : this.addendumDataService.update(this.addendum);

        this.loadPanelService.showLoader();

        createUpdatePromise
            .then(() => {
                this.addendumDataGrid.instance.refresh();
                this.resetCreateUpdateAddendumForm();
                this.isCreateUpdatePopupOpened = false;
                this.loadPanelService.hideLoader();
            })
            .catch(error => {
                this.loadPanelService.hideLoader();
                this.toastService.showErrorMessage(error.message ? error.message : error);
            })
    }

    private init(): void {
        this.addendum = new Addendum();
        this.initAddendumDataSource();
    }

    private initAddendumDataSource() {
        this.addendumDataSource.store = new CustomStore({
            byKey: (key) => {
                if (!key)
                    return Promise.resolve();

                return this.addendumDataService
                    .getById(key);
            },
            load: (loadOptions: any) => {
                const admissionFilter = ["AdmissionId", "=", this.admissionId];

                if (!loadOptions.filter) {
                    loadOptions.filter = admissionFilter;
                }
                else {
                    if (ArrayHelper.isArray(loadOptions.filter[0])) {
                        loadOptions.filter.push("and");
                        loadOptions.filter.push(admissionFilter);
                    }
                    else {
                        loadOptions.filter = [
                            loadOptions.filter,
                            "and",
                            admissionFilter,
                        ]
                    }
                }
                return this.addendumDataService
                    .searchWithCount(loadOptions, "Id")
                    .catch(error => this.toastService
                        .showErrorMessage(error.message ? error.message : error));
            }
        });
    }
}