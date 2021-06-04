import { LookupTables } from "../enums/lookupTables";
import { DataService } from "../provider/dataService";
import { ToastService } from "../provider/toastService";
import { ValidationMasks } from "../constants/validationMasks";
import { ApplicationConfigurationService } from "../provider/applicationConfigurationService";
import { ValidationRegexRules } from "../helpers/validationRegexRules";
import { TableNames } from "../constants/tableNames";

export class BaseComponent {
    protected lookups: any;
    protected tableNames: any;
    protected validationHelper: any = {};
    protected validationRegexRules;

    protected applicationConfiguration: any = {};

    protected isLoadPanelVisible: boolean = false;

    protected searchText: string = "";

    constructor(protected dataService: DataService,
        protected toastService: ToastService) {
        this.lookups = LookupTables;
        this.validationHelper.masks = ValidationMasks;
        this.validationRegexRules = ValidationRegexRules;
        this.applicationConfiguration = ApplicationConfigurationService;
        this.tableNames = TableNames;
    }

    protected getErrorMessage(error): string {
        return error.message ? error.message : error;
    }

    protected validatePhoneMaskWhenValueIsNotRequired(phone): boolean {
        return !phone || /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/.test(phone)
    }
}

export abstract class BaseManagementComponent extends BaseComponent {
    constructor(dataService: DataService, toastService: ToastService) {
        super(dataService, toastService);
    }
}