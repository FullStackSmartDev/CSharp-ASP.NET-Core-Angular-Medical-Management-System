import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../provider/dataService';
import { CompanyIdService } from '../../provider/companyIdService';
import { StringHelper } from '../../helpers/stringHelper';
import { BaseComponent } from '../baseComponent';
import { ToastService } from '../../provider/toastService';
import { Company } from '../../dataModels/company';
import { CompanyDataService } from '../../provider/dataServices/readCreateUpdate/readCreateUpdateDataServices';
import { LoadPanelService } from '../../provider/loadPanelService';
import { DxFormComponent } from 'devextreme-angular';
import { ExtraFieldsTabComponent } from './extraFieldsTabComponent';

@Component({
    templateUrl: 'companyFormComponent.html',
    selector: 'company-form'
})

export class CompanyFormComponent extends BaseComponent implements OnInit {
    @ViewChild("companyCreationForm") companyCreationForm: DxFormComponent;
    //@ViewChild("extraFieldsTab") extraFieldsTab: ExtraFieldsTabComponent;

    company: Company;
    isCompanySet: boolean = false;

    constructor(dataService: DataService,
        private loadPanelService: LoadPanelService,
        private companyDataService: CompanyDataService,
        private companyIdService: CompanyIdService, toastService: ToastService) {
        super(dataService, toastService);

        this.company = new Company();
    }

    updateCompany(): void {
        const validationResult = this.companyCreationForm
            .instance
            .validate();

        if (!validationResult.isValid) {
            return;
        }

        this.loadPanelService
            .showLoader();

        this.companyDataService
            .update(this.company)
            // .then(() => {
            //     return this.extraFieldsTab
            //         .saveExtraFields();
            // })
            .then(() => {
                this.loadPanelService
                    .hideLoader();
            })
            .catch(error => {
                this.loadPanelService
                    .hideLoader();
                this.toastService
                    .showErrorMessage(StringHelper.format("Error {0}", error.message ? error.message : error))
            });
    }

    ngOnInit(): void {
        const companyId = this.companyIdService.companyId;
        if (!companyId)
            throw "Company Id is not specified for this application"

        this.companyDataService.getById(companyId)
            .then(company => {
                this.company = company;
                this.isCompanySet = true;
            })
            .catch(error => {
                this.toastService
                    .showErrorMessage(StringHelper.format("Error {0}", error.message ? error.message : error));
            })
    }

    // onExtraFieldsTabCreated($event) {
    //     if ($event) {
    //         this.companyCreationForm.items[0]["tabs"].push($event);
    //         this.companyCreationForm.instance.repaint();
    //     }
    // }
}