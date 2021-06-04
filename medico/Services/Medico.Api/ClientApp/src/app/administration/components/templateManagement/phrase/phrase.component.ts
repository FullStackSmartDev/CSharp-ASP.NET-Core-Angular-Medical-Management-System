import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BaseAdminComponent } from 'src/app/_classes/baseAdminComponent';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent } from 'devextreme-angular';
import { AdminRichTextEditorComponent } from '../../../../share/components/admin-rich-text-editor/admin-rich-text-editor.component';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { Subscription } from 'rxjs';
import { ButtonKeyCodes } from 'src/app/_classes/buttonKeyCodes';
import { Phrase } from 'src/app/administration/models/phrase';
import { DxDataUrlService } from 'src/app/_services/dxDataUrl.service';
import { AlertService } from 'src/app/_services/alert.service';
import { EntityNameService } from 'src/app/_services/entityName.service';
import { CompanyIdService } from 'src/app/_services/company-id.service';
import { PhraseService } from 'src/app/administration/services/phrase.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { DevextremeAuthService } from 'src/app/_services/devextreme-auth.service';
import { PatientSelectableRootComponent } from 'src/app/share/components/patient-selectable-root/patient-selectable-root.component';
import { SelectableItemHtmlService } from 'src/app/_services/selectable-item-html.service';
import { SelectableListService } from 'src/app/_services/selectable-list.service';
import { PatientSelectableListComponent } from 'src/app/share/components/patient-selectable-list/patient-selectable-list.component';
import { PatientSelectableDateComponent } from 'src/app/share/components/patient-selectable-date/patient-selectable-date.component';
import { PatientSelectableRangeComponent } from 'src/app/share/components/patient-selectable-range/patient-selectable-range.component';
import { LibrarySelectableListService } from 'src/app/administration/services/library/library-selectable-list.service';
import { BaseSelectableListService } from 'src/app/_services/base-selectable-list.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: "phrase",
    templateUrl: "phrase.component.html"
})
export class PhraseComponent extends BaseAdminComponent implements OnInit, OnDestroy {
    @ViewChild("phrasesGrid", { static: false }) phrasesGrid: DxDataGridComponent;
    @ViewChild("phrasePopup", { static: false }) phrasePopup: DxPopupComponent;
    @ViewChild("phraseForm", { static: false }) phraseForm: DxFormComponent;

    @ViewChild("phraseContentRichTextEditor", { static: false }) phraseContentRichTextEditor: AdminRichTextEditorComponent;

    private _baseSelectableListService: BaseSelectableListService;

    selectableRoot: PatientSelectableRootComponent;

    isPhrasePreviewVisible: boolean = false;

    companyId: string = GuidHelper.emptyGuid;
    companyIdSubscription: Subscription;

    deleteBtnKeyCode: number = ButtonKeyCodes.delete;
    backspaceBtnKeyCode: number = ButtonKeyCodes.backspace;

    phraseId: string = "";
    phrase: Phrase;
    selectedPhrases: Array<Phrase>;

    phraseDataSource: any = {};

    isPhraseFormVisible: boolean = false;
    isNewPhrase: boolean;

    constructor(private dxDataUrlService: DxDataUrlService,
        private alertService: AlertService,
        private phraseService: PhraseService,
        private entityNameService: EntityNameService,
        private companyIdService: CompanyIdService,
        private devextremeAuthService: DevextremeAuthService,
        private selectableItemHtmlService: SelectableItemHtmlService,
        private selectableListService: SelectableListService,
        private librarySelectableListService: LibrarySelectableListService) {
        super();

        this.initPatientSelectableRootComponents();
    }

    ngOnDestroy(): void {
        this.companyIdSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.init();
        this.subscribeToCompanyIdChanges();
    }

    showPhrasePreview() {
        this.isPhrasePreviewVisible = true;
    }

    onPhrasePreviewHidden() {
        this.isPhrasePreviewVisible = false;
    }

    onPhraseChanged($event) {
        const phrase = $event.selectedRowKeys[0];
        if (!phrase) {
            return;
        }
        const phraseId = phrase.id
        if (!phraseId)
            return;

        this.phraseService.getById(phraseId)
            .then(phrase => {
                this.phrase = phrase;
                this.isNewPhrase = false;
                this.isPhraseFormVisible = true;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    onSelectableItemValueGenerated($event) {
        this.phraseContentRichTextEditor.insertContent($event);
    }

    savePhrase() {
        const validationResult = this.validatePhrase();

        if (!validationResult.success) {
            this.alertService.alert(validationResult.message, validationResult.title);
            return;
        }

        if (this.isNewPhrase)
            this.phrase.companyId = this.companyId;

        this.phraseService.save(this.phrase)
            .then(() => {
                this.resetPhraseForm();
                this.isPhraseFormVisible = false;
            })
            .catch((error) => this.alertService.error(error.message ? error.message : error));
    }

    switchToPhraseForm() {
        this.isNewPhrase = true;
        this.isPhraseFormVisible = true;
    }

    switchToPhrasesDataGrid() {
        this.resetPhraseForm();
        this.isPhraseFormVisible = false;
    }

    validateGeneratedName = (params) => {
        const value = params.value;
        this.entityNameService
            .tryGetUniqueNameForEntityRecord(value, this.phraseService, this.companyId)
            .then(validationResult => {
                const isValidationSucceeded
                    = validationResult.success;

                if (isValidationSucceeded) {
                    this.phrase.name = validationResult.generatedName;
                }

                params.rule.isValid = isValidationSucceeded;
                params.rule.message = validationResult.errorMessage;

                params.validator.validate();
            });

        return false;
    }

    deletePhrase(phrase: any, $event: any) {
        $event.stopPropagation();

        const confirmationPopup = this.alertService
            .confirm("Are you sure you want to delete the phrase ?", "Confirm deletion");

        confirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.phraseService.delete(phrase.id)
                    .then(() => {
                        this.phrasesGrid.instance.refresh();
                    })
                    .catch((error) => this.alertService.error(error.message ? error.message : error));
            }
        })
    }

    private init() {
        this.phrase = new Phrase();
        this.isNewPhrase = true;

        this.initPhraseDataSource();
    }

    private initPhraseDataSource() {
        this.phraseDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getGridUrl("phrase"),
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => {
                    jQueryAjaxSettings.data.companyId = this.companyId;
                }, this)
        });
    }

    private resetPhraseForm() {
        this.phraseId = "";
        this.phrase = new Phrase();

        this.selectedPhrases = [];
        this.isNewPhrase = true;
    }

    private validatePhrase(): any {
        const validationResult = this.phraseForm.instance.validate();

        this.phrase.content =
            this.phraseContentRichTextEditor.content;

        if (!validationResult.isValid) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "Navigate to the 'Base Info' tab"
            };
        }

        if (!this.phrase.content) {
            return {
                success: false,
                title: "VALIDATION ERROR",
                message: "The phrase content is required"
            };
        }

        return {
            success: true,
            title: "",
            message: ""
        };
    }

    private subscribeToCompanyIdChanges() {
        this.companyIdSubscription = this.companyIdService.companyId
            .subscribe(companyId => {
                if (companyId) {
                    this.companyId = companyId;

                    this.selectableRoot.patientSelectableList.companyId
                        = companyId;

                    if (this.phrasesGrid && this.phrasesGrid.instance)
                        this.phrasesGrid.instance.refresh();
                }
            });
    }

    private initPatientSelectableRootComponents() {
        this.selectableRoot = new PatientSelectableRootComponent();

        this.selectableRoot.patientSelectableList =
            new PatientSelectableListComponent(this.selectableItemHtmlService,
                this.alertService, this.selectableListService, this.librarySelectableListService);

        this.selectableRoot.patientSelectableDate =
            new PatientSelectableDateComponent(this.alertService, this.selectableItemHtmlService);

        this.selectableRoot.patientSelectableRange =
            new PatientSelectableRangeComponent(this.selectableItemHtmlService, this.alertService);
    }
}