import { AlertService } from "../../provider/alertService";
import { LoadPanelService } from "../../provider/loadPanelService";
import { ApplicationConfigurationService } from "../../provider/applicationConfigurationService";
import { ToastService } from "../../provider/toastService";
import { ArrayHelper } from "../../helpers/arrayHelper";
import { IEntityCountProvider } from "../../provider/sqlDataSource/iSearchableSource";
import { DefaultValuesProvider } from "../../provider/defaultValuesProvider";
import { LookupItemsAppService, LookupItemListMetadata } from "../../provider/appServices/lookupItemsAppService";

export abstract class BaseHistoryComponent {
    protected applicationConfiguration: any;
    protected isHistoryExist: boolean = false;

    defaultHistoryValue: string = "";

    constructor(protected alertService: AlertService,
        protected loadPanelService: LoadPanelService,
        protected toastService: ToastService,
        private defaultValueProviders: DefaultValuesProvider,
        private lookupItemsAppService: LookupItemsAppService) {

        this.applicationConfiguration =
            ApplicationConfigurationService;

        this.setLookupItems();
    }

    setLookupItems() {
        const lookupItemListMetadata = this.lookupItemNames
            .map(ln => new LookupItemListMetadata(ln));

        this.lookupItemsAppService
            .setLookupItemLists(lookupItemListMetadata, this);
    }

    abstract get lookupItemNames(): Array<string>;

    protected setHistoryExistanceAndDefaultValue(patientId: string,
        entityCountProvider: IEntityCountProvider, historyName: string) {
        const loadOptions = {};
        this.customizeHistoryLoadOptions(loadOptions, patientId);

        entityCountProvider
            .count(loadOptions, "Id")
            .then(count => {
                this.isHistoryExist = !!count;
                if (this.isHistoryExist) {
                    this.defaultHistoryValue = "";
                }
                else {
                    this.defaultValueProviders.getByName(historyName)
                        .then(defaultHistoryValue => {
                            this.defaultHistoryValue = defaultHistoryValue;
                        });
                }
            });
    }

    protected customizeHistoryLoadOptions(loadOptions: any, patientId: string): void {
        const byPatientIdFilter = ["PatientId", "=", patientId];
        const nonDeletedItemsFilter = ["IsDelete", "=", false];

        if (!loadOptions.filter) {
            loadOptions.filter = [
                byPatientIdFilter,
                "and",
                nonDeletedItemsFilter
            ];
        }
        else {
            if (ArrayHelper.isArray(loadOptions.filter[0])) {
                loadOptions.filter.push("and");
                loadOptions.filter.push(byPatientIdFilter);
                loadOptions.filter.push("and");
                loadOptions.filter.push(nonDeletedItemsFilter);
            }
            else {
                loadOptions.filter = [
                    loadOptions.filter,
                    "and",
                    byPatientIdFilter,
                    "and",
                    nonDeletedItemsFilter
                ]
            }
        }
    }
}