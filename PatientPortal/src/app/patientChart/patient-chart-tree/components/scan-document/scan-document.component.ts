import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DxFormComponent, DxListComponent, DxScrollViewComponent } from "devextreme-angular";
import { WebcamImage } from "ngx-webcam";
import ImageEditor from "tui-image-editor";
import { ToastUiImageEditorComponent } from "ngx-tui-image-editor";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { SelectableListService } from "src/app/_services/selectable-list.service";
import { DocumentService } from "../../services/document.service";
import { Document } from "../../../models/document";
import { DxDataUrlService } from "src/app/_services/dxDataUrl.service";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import { PatientChartTrackService } from "../../../../_services/patient-chart-track.service";
import { AlertService } from "../../../../_services/alert.service";
import { DevextremeAuthService } from "src/app/_services/devextreme-auth.service";
import { PredefinedSelectableListsNames } from 'src/app/_classes/predefinedSelectableListsNames';
import { SelectableListConfig } from 'src/app/_models/selectableListConfig';

declare let scanner;
declare let Tiff: any;
declare let $: any;

@Component({
    templateUrl: "scan-document.component.html",
    selector: "scan-document",
    styleUrls: ["scan-document.component.css"]
})

export class ScanDocumentComponent implements OnInit, AfterViewInit {
    @Input() isSignedOff: boolean;
    @Input() patientId: string;
    @Input() appointmentId: string;
    @Input() pageNum: string;
    @Input() companyId: string;

    @ViewChild("scanDocumentForm", { static: false }) scanDocumentForm: DxFormComponent;
    @ViewChild("list", { static: false }) list: DxListComponent;
    @ViewChild(ToastUiImageEditorComponent, { static: false }) editorComponent: ToastUiImageEditorComponent;
    @ViewChild("scrollView", { static: false }) scrollView: DxScrollViewComponent;

    canOpenUploadImageForm: boolean = false;

    imageEditor: any;
    documentType: any = {};
    icdCodesDataSource: any = {};
    isGetImagePopupOpened: boolean = false;
    isSetQualityPopupOpened: boolean = false;

    value: any[] = [];
    previewImage: any = "";
    documentsource: any = 1;
    documentSourceData: string = "From Computer";

    scale = 1;

    document: Document = new Document();

    public pageCount = 0;

    public currentPage = 0;

    public webcamImage: WebcamImage = null;

    public currentImage: string = "";

    //Tiff Drawing Variables
    public isTiff = false;
    public isCurrentMultiTiff = false;
    public tiffCanvas: any[] = [];
    public currentTiffPage = 0;

    public documentData: any[] = [];
    public documentList: DataSource;

    public currentDocumentData: any = {};

    private trigger: Subject<void> = new Subject<void>();

    private isDrawing = false;
    private fullScreen_width = 0;
    private el: any;
    private ctx: any;

    scrollByContent = true;
    scrollByThumb = true;
    scrollbarMode: string = "onScroll";
    pullDown = false;

    bConfigSaved = true;

    public imageEditorOptions: any = {
        includeUI: {
            menu: ["draw", "crop", "flip", "text", "rotate"]
        }
    }

    //todo: include "from scanner" source when we will have scanner device
    //templateStates: Array<string> = ["From Computer", "From Webcam", "From Scanner"];
    templateStates: Array<string> = ["From Computer", "From Webcam"];
    configOptions: Array<string> = ["Update", "Save"];
    isDetailedTemplate: boolean;
    public ImageQuality = "";

    constructor(private dxDataUrlService: DxDataUrlService,
        private selectableListService: SelectableListService,
        private documentService: DocumentService,
        private patientChartTrackService: PatientChartTrackService,
        private alertService: AlertService,
        private devextremeAuthService: DevextremeAuthService) {
    }

    get associatedDocumentationListValues(): string[] {
        return this.selectableListService
            .getSelectableListValuesFromComponent(this, PredefinedSelectableListsNames.associatedDocumentation)
    }

    onTemplateStateChanged($event) {
        for (let i = 0; i < this.templateStates.length; i++) {
            if (this.templateStates[i] == $event.value) {
                this.documentsource = i + 1;
            }
        }
        this.documentSourceData = $event.value;
    }

    onOptionsStateChanged($event) {
        if ($event.value == "Save") {
            this.bConfigSaved = true;
        }
        else {
            this.bConfigSaved = false;
        }
    }

    ngOnInit() {
        this.initSelectableLists();
        this.initIcdCodeDataSource()
    }

    ngAfterViewInit() {
        this.initImageEditor();
        this.init();
    }

    openGetImageForm() {
        this.isGetImagePopupOpened = true;
    }
    updateTopContent = (e) => {
    }
    updateBottomContent = (e) => {
    }
    fullScreenImage() {
    }
    zoomInImage() {
        var imageEditorWindow = $("#tuiImageEditor .tui-image-editor");
        var initWidth = $("#tuiImageEditor .tui-image-editor").css("width");
        var initHeight = $("#tuiImageEditor .tui-image-editor").css("height");
        $("#tuiImageEditor .tui-image-editor").css("width", parseInt(initWidth, 10) * 1.1 + "px");
        $("#tuiImageEditor .tui-image-editor").css("height", parseInt(initHeight, 10) * 1.1 + "px");
        $("#tuiImageEditor").find("canvas, .tui-image-editor-canvas-container")
            .css("max-width", parseInt(initWidth, 10) * 1.1 + "px")
            .css("max-height", parseInt(initHeight, 10) * 1.1 + "px");

    }
    zoomOutImage() {
        var imageEditorWindow = $("#tuiImageEditor .tui-image-editor");
        var initWidth = $("#tuiImageEditor .tui-image-editor").css("width");
        var initHeight = $("#tuiImageEditor .tui-image-editor").css("height");
        $("#tuiImageEditor .tui-image-editor").css("width", parseInt(initWidth, 10) * 0.9 + "px");
        $("#tuiImageEditor .tui-image-editor").css("height", parseInt(initHeight, 10) * 0.9 + "px");
    }

    private initIcdCodeDataSource(): void {
        this.icdCodesDataSource.store = createStore({
            loadUrl: this.dxDataUrlService.getLookupUrl("icdcode"),
            key: "Id",
            onBeforeSend: this.devextremeAuthService
                .decorateOnBeforeSendMethod((method, jQueryAjaxSettings) => { }, this)
        });
    }

    private initImageEditor() {
        // this.imageEditor = this.editorComponent.editorInstance;
        this.imageEditor = new ImageEditor(document.querySelector("#tuiImageEditor"), {
            includeUI: {
                menu: ["draw", "crop", "flip", "text", "rotate", "filter"],
                initMenu: "",
                uiSize: {
                    width: "100%",
                    height: "100%"
                },
                menuBarPosition: "bottom"
            },
            cssMaxWidth: 1000,
            cssMaxHeight: 1000,
            selectionStyle: {
                cornerSize: 20,
                rotatingPointOffset: 70
            }
        });
        $("#tuiImageEditor .tui-image-editor").on("mousewheel", (e) => {


            let imageOriginalSize = {
                width: this.imageEditor._graphics.canvasImage.width,
                height: this.imageEditor._graphics.canvasImage.height
            };
            let wDelta = e.originalEvent.wheelDelta || e.originalEvent.deltaY;
            let imageEditorWindow = e.currentTarget;
            let scrollContainer = $(".tui-image-editor-wrap");
            let initWidth = imageEditorWindow.style.width;
            let initHeight = imageEditorWindow.style.height;
            let scrollContainerInitial = {
                top: scrollContainer.scrollTop(),
                left: scrollContainer.scrollLeft(),
                height: scrollContainer[0].scrollHeight,
                width: scrollContainer[0].scrollWidth
            };
            let mousePosition = {
                top: e.clientY - $(imageEditorWindow).offset().top,
                left: e.clientX - $(imageEditorWindow).offset().left
            };
            let newWidth;
            let newHeight;
            let offsetY;
            let offsetX;
            // Zoom step 10%
            if (wDelta > 0) {
                newWidth = parseInt(initWidth, 10) * 1.1;
                newHeight = parseInt(initHeight, 10) * 1.1;
                // Limit maximum zoom by image resolution

            } else {
                newWidth = parseInt(initWidth, 10) * 0.9;
                newHeight = parseInt(initHeight, 10) * 0.9;
                // Limit minimum zoom by 0.3 of original container size
                if (parseInt(imageEditorWindow.dataset.minWidth, 10) * 0.3 > parseInt(newWidth, 10)) {
                    newWidth = parseInt(imageEditorWindow.dataset.minWidth, 10) * 0.3;
                    newHeight = parseInt(imageEditorWindow.dataset.minHeight, 10) * 0.3;
                }
            }
            imageEditorWindow.style.width = newWidth + "px";
            imageEditorWindow.style.height = newHeight + "px";
            $(imageEditorWindow).find("canvas, .tui-image-editor-canvas-container")
                .css("max-width", imageEditorWindow.style.width)
                .css("max-height", imageEditorWindow.style.height);

            // Save initial size of container
            if (imageEditorWindow.dataset.minHeight === undefined) {
                imageEditorWindow.dataset.minHeight = initHeight;
                imageEditorWindow.dataset.minWidth = initWidth;
            }

            // Calculate scroll offset for new position
            offsetY = (scrollContainer[0].scrollHeight - scrollContainerInitial.height)
                * (mousePosition.top / scrollContainerInitial.height);
            offsetX = (scrollContainer[0].scrollWidth - scrollContainerInitial.width)
                * (mousePosition.left / scrollContainerInitial.width);

            scrollContainer.scrollTop(scrollContainerInitial.top + offsetY);
            scrollContainer.scrollLeft(scrollContainerInitial.left + offsetX);

            e.preventDefault();
            e.stopPropagation();
        });
        // Prevent scroll with wheel
        $(".tui-image-editor-wrap")[0].onwheel = function () { return false; };
        // Prevent overlapping from toolbar
        $(".tui-image-editor-wrap").css("height", "100%");
        // Hide Header
        $(".tui-image-editor-header").hide();


    }
    public begin() {

        let dataUrl = this.imageEditor.toDataURL();
        let ctx = this.tiffCanvas[this.currentTiffPage].getContext("2d");
        let img = new Image;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        img.src = dataUrl;
        this.currentTiffPage = 0;
        this.drawTiff();
    }

    public end() {

        let dataUrl = this.imageEditor.toDataURL();
        let ctx = this.tiffCanvas[this.currentTiffPage].getContext("2d");
        let img = new Image;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        img.src = dataUrl;

        this.currentTiffPage = this.tiffCanvas.length - 1;
        this.drawTiff();
    }

    public previous() {

        let dataUrl = this.imageEditor.toDataURL();
        let ctx = this.tiffCanvas[this.currentTiffPage].getContext("2d");
        let img = new Image;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        img.src = dataUrl;

        if (this.currentTiffPage > 0) {
            this.currentTiffPage -= 1;
            this.drawTiff();
        }
    }

    public next() {
        let dataUrl = this.imageEditor.toDataURL();
        let ctx = this.tiffCanvas[this.currentTiffPage].getContext("2d");
        let img = new Image;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        img.src = dataUrl;

        if (this.tiffCanvas.length > this.currentTiffPage + 1) {
            this.currentTiffPage += 1;
            this.drawTiff();
        }
    }

    public selectDocument(e) {
        let selectedId = this.list.selectedItemKeys[0];
        if (selectedId <= this.documentData.length) {
            this.setPageNum(selectedId);
        }
    }

    public save(e) {
        e.preventDefault();
        if (this.currentDocumentData.documentName != "" && this.currentDocumentData.documentName != null) {

            if (!this.isTiff) {
                this.currentImage = this.imageEditor.toDataURL();
                this.uploadImageToServer(this.currentImage);
            }
            else {
                let dataUrl = this.imageEditor.toDataURL();
                let ctx = this.tiffCanvas[this.currentTiffPage].getContext("2d");
                let img = new Image;
                let that = this;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);
                    that.uploadTiffToServer();
                }
                img.src = dataUrl;

            }
        }
    }
    public getPageNum() {
        if (this.documentData.length > 0) {
            return this.documentData[this.documentData.length - 1].pageNum + 1;
        }
        return 1;
    }

    private uploadImageToServer(imageDataURI, fileName = "") {
        let imageFile = this.dataURItoBlob(imageDataURI);
        let formdata = new FormData();
        let filename = "";

        if (fileName != "") {
            filename = fileName;
        } else {
            filename = this.getRandomFileName() + "." + imageFile.type.split("/")[1];
        }

        formdata.append("file", imageFile, filename)
        this.documentService.uploadFile(this.appointmentId, this.patientId, formdata).subscribe(
            response => {
                /// Create A Document Data After Upload Image to Server
                let document = {};
                document["imageData"] = response["dbPath"];

                let currentDocumentData = this.scanDocumentForm.instance.option("formData");
                document = { ...currentDocumentData, ...document };
                if (this.bConfigSaved) {//save new
                    document["pageNum"] = this.getPageNum();
                    this.documentData.push(document);
                }
                else {//update exist
                    this.documentData[this.currentPage - 1] = document;
                }

                /// Update Document List Data
                this.updateDocumentList();

                /// Save data
                this.saveAll();
                this.isGetImagePopupOpened = false;

            },
            error => {
                console.log(error);
            }
        )
    }

    private uploadTiffToServer() {
        let formData = new FormData();
        for (let i = 0; i < this.tiffCanvas.length; i++) {
            let imageFile = this.dataURItoBlob(this.tiffCanvas[i].toDataURL());
            let filename = this.getRandomFileName() + "." + imageFile.type.split("/")[1];
            formData.append("file", imageFile, filename);
        }
        let tiffFileName = this.getRandomFileName() + ".tiff";
        formData.append("filename", tiffFileName);
        this.documentService.uploadTiffFile(this.appointmentId, this.patientId, formData).subscribe(
            response => {
                /// Create A Document Data After Upload Image to Server
                let document = {};
                document["imageData"] = response["dbPath"];

                let currentDocumentData = this.scanDocumentForm.instance.option("formData");
                document = { ...currentDocumentData, ...document };

                if (this.bConfigSaved) {//save new
                    document["pageNum"] = this.getPageNum();
                    this.documentData.push(document);
                }
                else {//update exist
                    this.documentData[this.currentPage - 1] = document;
                }

                /// Update Document List Data
                this.updateDocumentList();

                /// Save data
                this.saveAll();
                this.isGetImagePopupOpened = false;
            },
            error => {
                console.log(error);
            }
        );
    }

    public saveAll() {
        if (this.document == null) {
            this.document = new Document();
        }
        this.document.patientId = this.patientId;
        this.document.documentData = JSON.stringify(this.documentData);
        this.documentService.save(this.document).then(document => {
            this.patientChartTrackService.emitPatientChartChanges(true);
        });


    }

    public setPageNum(pageNum) {
        if (pageNum > 0) {
            this.currentPage = pageNum;
            let pageIdx = 0;
            for (let idx = 0; idx < this.documentData.length; idx++) {
                if (this.documentData[idx].pageNum == this.currentPage) {
                    pageIdx = idx;
                    break;
                }
            }
            this.currentDocumentData = { ...this.documentData[pageIdx], ...this.currentDocumentData };
            this.scale = 1;
            this.documentService.getImageData(this.documentData[pageIdx].imageData).subscribe(
                response => {
                    this.currentImage = response["dataUrl"];
                    this.processWithImage();
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.currentPage = 0;
            this.currentDocumentData = {};
            let canvasSize = this.imageEditor.getCanvasSize();
            this.imageEditor.ui.resizeEditor({
                imageSize: { oldWidth: canvasSize.oldWidth, oldHeight: canvasSize.oldHeight, newWidth: 0, newHeight: 0 }
            });
        }
    }

    private drawImage(image, name, isMultiTiff = false) {
        let that = this;
        this.previewImage = image;
        this.imageEditor.loadImageFromURL(image, name)
            .then(result => {
                that.imageEditor.resizeCanvasDimension(1000, 1000);
                that.imageEditor.ui.activeMenuEvent();
                that.imageEditor.ui.resizeEditor({
                    imageSize: { oldWidth: result.oldWidth, oldHeight: result.oldHeight, newWidth: result.newWidth, newHeight: result.newHeight },
                });
            })
            .catch(err => {
                console.error("Something went wrong:", err);
            });
    }

    private updateDocumentList() {
        //todo: temporary fix:  exclude null documents
        const data = this.documentData
            .filter((document) => !!document)
            .map((value, index) => {
                return { id: index + 1, text: value.documentName }
            });

        this.documentList = new DataSource({
            store: new ArrayStore({
                key: "id",
                data
            })
        });
    }

    private drawTiff() {
        let name = "";
        if (this.currentPage > this.documentData.length) {
            name = "Untitled";
        }
        else {
            name = this.currentDocumentData.documentName;
        }
        let image = this.tiffCanvas[this.currentTiffPage].toDataURL();
        this.previewImage = image;
        this.drawImage(image, name, this.isCurrentMultiTiff);
    }

    public deleteDocument() {
        const deleteDocumentConfirmationPopup = this.alertService.confirm("Are you sure you want to delete this document ?", "Confirm deletion");

        deleteDocumentConfirmationPopup.then(dialogResult => {
            if (dialogResult) {
                this.documentData = this.documentData.filter(document => document.imageData != this.currentDocumentData.imageData);
                this.saveAll();
                this.alertService.info("document is deleted successfully");
                if (this.documentData.length != 0) {
                    if (this.currentPage != 1) {
                        this.setPageNum(this.currentPage - 1);
                    } else {
                        this.setPageNum(this.currentPage);
                    }
                } else {
                    this.setPageNum(0);
                }
            }
        });

    }

    public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.currentImage = webcamImage.imageAsDataUrl;
        this.isTiff = false;
        this.isCurrentMultiTiff = false;
        this.drawImage(this.currentImage, "Untitled");
        this.previewImage = this.currentImage;
    }

    public fileUploaderValueChange(event) {
        let value = event.value[0];
        let extenstion = value.name.split(".").pop().toLowerCase();
        let tiffFileTypes = ["tiff", "tif"];
        let reader = new FileReader();
        let that = this;
        reader.onload = function (e) {
            /// Tiff
            if (tiffFileTypes.indexOf(extenstion) > -1) {
                that.isTiff = true;
            } else {
                that.isTiff = false;
            }
            that.previewImage = reader.result;
            that.processScannedImage(reader.result);
        }
        reader.readAsDataURL(value);
    }

    public processWithImage() {
        if (!this.checkTiff(this.currentImage)) {
            this.isTiff = false;
            this.isCurrentMultiTiff = false;
            this.drawImage(this.currentImage, this.currentDocumentData.documentName);
        } else {
            this.isTiff = true;
            this.processTiff(this.currentImage);
        }
    }

    private init() {
        this.documentService.getByPatientId(this.patientId).then(
            document => {
                if (document != null) {
                    this.document = document;
                    if (document.documentData != "") {
                        this.documentData = JSON.parse(document.documentData);
                    }

                    this.updateDocumentList();
                }
                this.setPageNum(parseInt(this.pageNum));
            }
        );

    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public scanToJpg() {
        scanner.scan(this.displayImagesOnPage,
            {
                "output_settings": [
                    {
                        "type": "return-base64",
                        "format": "jpg"
                    }
                ]
            }
        );
    }

    private displayImagesOnPage = (successful, mesg, response) => {
        if (!successful) { // On error
            console.error("Failed: " + mesg);
            return;
        }
        if (successful && mesg != null && mesg.toLowerCase().indexOf("user cancel") >= 0) { // User cancelled.
            console.info("User cancelled");
            return;
        }
        let scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
        for (let i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
            let scannedImage = scannedImages[i];
            this.processScannedImage(scannedImage);
        }
    }

    private processScannedImage(scannedImage) {
        this.currentImage = scannedImage;
        if (!this.isTiff) {
            this.drawImage(this.currentImage, "Untitled");
        } else {
            this.processTiff(this.currentImage)
        }
    }

    private processTiff(tiffImageDataUri) {
        let tiffblob = this.dataURItoBlob(tiffImageDataUri);
        let reader = new FileReader();
        reader.readAsArrayBuffer(tiffblob);
        let that = this;
        this.currentTiffPage = 0;
        reader.onload = function (e) {
            Tiff.initialize({ TOTAL_MEMORY: 16777216 * 10 });
            let tiff = new Tiff({ buffer: reader.result });


            let len = tiff.countDirectory();
            if (len > 1) {
                that.isCurrentMultiTiff = true;
            } else {
                that.isCurrentMultiTiff = false;
            }
            that.tiffCanvas = [];
            for (let i = 0; i < len; i++) {
                tiff.setDirectory(i);
                that.tiffCanvas.push(tiff.toCanvas());
            }
            that.drawTiff()
        }
    }

    private dataURItoBlob(dataURI) {
        let byteString = atob(dataURI.split(",")[1]);

        let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }

    private getRandomFileName() {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        const lengthOfCode = 16;
        let text = "";
        for (let i = 0; i < lengthOfCode; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private checkTiff(dataURI) {
        let type = dataURI.substring("data:image/".length, dataURI.indexOf(";base64"));
        if (type.toLowerCase().indexOf("tif") !== -1 || type.toLowerCase().indexOf("tiff") !== -1)
            return true;
        return false;
    }

    private initSelectableLists() {
        const associatedDocumentationListConfig =
            new SelectableListConfig(this.companyId, PredefinedSelectableListsNames.associatedDocumentation);
        const selectableLists = [associatedDocumentationListConfig];

        this.selectableListService
            .setSelectableListsValuesToComponent(selectableLists, this)
            .then(() => {
                this.canOpenUploadImageForm = true;
            })
            .catch(error => this.alertService.error(error.message ? error.message : error));
    }
}
