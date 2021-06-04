import { ElementRef } from '@angular/core';
import { ReportGeneratorService } from '../../provider/reportGeneratorService';
import {
    Component, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { PatienDataModelService } from '../../provider/patienDataModelService';
import { DataService } from '../../provider/dataService';
import { TableNames } from '../../constants/tableNames';
import { StringHelper } from '../../helpers/stringHelper';
import notify from 'devextreme/ui/notify';

@Component({
    templateUrl: 'report.html'
})
export class ReportPage {
    @ViewChild('report') report: ElementRef;

    patientDataModelTree: Array<any>;
    patientRoot: any;
    currentPatientDemographic: any = {};

    makeAdmissionReportBtnText: string = "Make report"
    makeAdmissionReportBtnType: string = "normal"

    exportReportAsPdfBtnText: string = "Export as PDF"
    exportReportAsPdfBtnType: string = "normal"

    example: string = '';
    reportHTML: string = '';

    reportName: string = 'Untitled report';

    presetOptions: string[] = [
        "Custom",
        "History and Physical",
        "Procedure",
        "Progress"
    ];

    reportPresets: {
        [id: string]: {
            include: string[]; exclude: string[];
        }
    } = {
            "Custom": {
                include: [],
                exclude: []
            },
            "History and Physical": {
                include: ["patientHistory", "chiefComplaint", "vitalSigns", "reviewOfSystems", "physicalExams"]
                , exclude: []
            },
            "Procedure": {
                include: ["tobacoHistory", "drugHistory", "alcoholHistory", "allergies", "medications", "vitalSigns"]
                , exclude: []
            },
            "Progress": {
                include: ["patientHistory", "chiefComplaint", "vitalSigns", "reviewOfSystems", "physicalExams"]
                , exclude: []
            }
        };


    constructor(
        public navCtrl: NavController,
        private patienDataModelService: PatienDataModelService,
        private navParams: NavParams, private dataService: DataService, private reportGenerator: ReportGeneratorService,
        private cdr: ChangeDetectorRef) {

        let appoinmentId = this.navParams.get('appoinmentId');

        if (!appoinmentId) {
            throw "Appointment Id should be specified";
        }

        let self = this;

        this.patienDataModelService.getPatientAdmission(appoinmentId)
            .then((admission) => {
                self.currentPatientDemographic.CreatedDate = admission.CreatedDate;

                self.patientRoot = JSON.parse(admission.AdmissionData).patientRoot;
                self.patientDataModelTree = [self.patienDataModelService
                    .getPatientDataModelTreeProjection(self.patientRoot, admission.IsSignedOff).items[2]];

                self.dataService.getById(TableNames.patientDemographic, admission.PatientDemographicId)
                    .then(patient => {
                        self.currentPatientDemographic.Name = StringHelper.format("{0} {1}", patient.FirstName, patient.LastName);
                    })
                    .catch(error => notify(error.message, "error", 1500));
            })
            .catch(error => notify(error.message, "error", 1500));
    }

    ChangeReportPreset(newPreset: string) {
        if (newPreset === "Custom") {
            return;
        }
        const listOfItemsToBeChecked = this.reportPresets[newPreset];

        if (listOfItemsToBeChecked.include.length > 0 || listOfItemsToBeChecked.exclude.length > 0) {
            this.ClearChecksRecursive(this.patientDataModelTree[0]);
            this.cdr.detectChanges();
            this.CheckItemsFromListRecursive(this.patientDataModelTree[0], listOfItemsToBeChecked);
        }

        this.reportName = newPreset;
    }

    CheckItemsFromListRecursive(node: any, listOfItemsToBeChecked: {
        include: string[]; exclude: string[];
    }) {
        if (listOfItemsToBeChecked.include.indexOf(node.name) !== -1) {
            this.CheckRecursive(node, true);
        }
        else if (listOfItemsToBeChecked.exclude.indexOf(node.name) !== -1) {
            this.CheckRecursive(node, false);
        } else {
            // node.checked = false;
            if (node.items.length > 0) {
                for (let i = 0; i < node.items.length; i++) {
                    this.CheckItemsFromListRecursive(node.items[i], listOfItemsToBeChecked);
                }
            }

        }
    }

    ClearChecksRecursive(node: any) {

        node.checked = false;
        if (node.items.length > 0) {
            for (let i = 0; i < node.items.length; i++) {
                this.ClearChecksRecursive(node.items[i]);
            }
        }
    }

    CheckChildItems(node: any, e) {
        if (e.previousValue === undefined) {
            for (let i = 0; i < node.items.length; i++) {
                this.CheckRecursive(node.items[i], false);

            }
            node.checked = false;
        }
        if (e.previousValue === false) {
            for (let i = 0; i < node.items.length; i++) {
                this.CheckRecursive(node.items[i], true);

            }
            node.checked = undefined;
        }
    }

    CheckRecursive(node: any, state: boolean) {
        if (node.items.length > 0) {
            for (let i = 0; i < node.items.length; i++) {
                this.CheckRecursive(node.items[i], state);
                if (state) {
                    node.checked = undefined;
                }
                else {
                    node.checked = false;
                }
            }
        }
        else {
            node.checked = state;
        }
    }


    makeAdmissionReport() {
        //         this.example =
        //             `Tobacco report
        //         Patient Name: alexis 1 fird
        //         Admission date: 2018-07-03T00:06:16.827Z
        //         Tobacco status: Never Smoked
        //         Tobacco Type: Tobacco
        //         Tobacco Amount: undefined     

        // `;

        let appoinmentId = this.navParams.get('appoinmentId');

        const demographic = this.patientRoot.children[0];
        this.reportHTML = '';

        this.reportGenerator.CreateReport(appoinmentId, this.patientDataModelTree).then(infoChunks => {

            if (infoChunks.length > 0) {


                // const presentInfo = new Set(infoChunks);
                var presentInfo: { [id: string]: any; } = {};
                for (let i = 0; i < infoChunks.length; i++) {
                    presentInfo[infoChunks[i].name] = infoChunks[i];
                }

                debugger




                this.reportHTML += `<h2>${this.reportName}</h2>
            <hr>
            <div class="two-table">
                <table class="">
                <tr>
                    <td>Claimant's Name</td>
                    <td>${this.currentPatientDemographic.Name}</td>
                    <td> </td>
                    <td>Date of Exam</td>
                    <td>${this.currentPatientDemographic.CreatedDate}</td>
                </tr>
                <tr>
                    <td>Date of Birth / Age</td>
                    <td>${demographic.children[1].value.DateOfBirth ? demographic.children[1].value.DateOfBirth : ''}</td>
                    <td> </td>
                    <td>RQID</td>
                    <td></td>
                </tr>
                 <tr>
                    <td>Case Number</td>
                    <td></td>
                    <td> </td>
                    <td>Consultative Examiner</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Social Security</td>
                    <td></td>
                    <td> </td>
                    <td>Location of Exam</td>
                    <td></td>
                </tr>
                </table>            
            </div>
            <br/><br/>
            <span class="paragrapgh-header">Statement of Examination</span>
            <br/>
            <span>Claimant was advised prior to exam that this is not a complete physical but is an administrative exam and a physician patient relationship has not been established and according to DDS requirements the claimant is not required to perform any maneuvers that cause pain or discomfort. Findings related to this examination were discussed with the claimant prior to termination of the exam and that the physician does not make determination of disability, this determination is made by DDS.  Additionally, the physical exam and paperwork take 30 minutes. Identification verified with a picture identification card.</span>
            <br/>`;

                this.reportHTML +=
                    `
            <br/>
            <div>
                <span class="paragrapgh-header">Records Reviewed</span>
                <br/>
                <ul>
                    <li>
                        Progress notes from UMC and Concentra.
                    </li>
                </ul>
            </div>
            <br/>
            `;

                console.log(this.reportHTML)

                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">History of Present Illness</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">Previous Medical History</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">Medications</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">Allergies</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                var socialHistoryList = [];

                const tobacoHistory = presentInfo["tobacoHistory"]
                if (tobacoHistory) {
                    if (tobacoHistory.value.tobaccoStatus === "Currently Smokes") {
                        if (tobacoHistory.value.tobaccoType) {
                            socialHistoryList.push(tobacoHistory.value.tobaccoType);
                        }
                        else {
                            socialHistoryList.push("tobacco");
                        }
                    }
                }
                const drugHistory = presentInfo["drugHistory"]
                if (drugHistory) {
                    if (drugHistory.value.drugStatus === "Currently Uses Drugs") {
                        if (drugHistory.value.drugType) {
                            socialHistoryList.push(drugHistory.value.drugType);
                        }
                        else {
                            socialHistoryList.push("drugs");
                        }
                    }

                }
                const alcoholHistory = presentInfo["alcoholHistory"]
                if (alcoholHistory) {
                    if (alcoholHistory.value.alcoholStatus === "Currently Drinks Alcohol") {
                        if (alcoholHistory.value.alcoholType) {
                            socialHistoryList.push(alcoholHistory.value.alcoholType);
                        }
                        else {
                            socialHistoryList.push("alcohol");
                        }
                    }
                }
                if (socialHistoryList.length > 0) {
                    var string = "";
                    for (let i = 0; i < socialHistoryList.length; i++) {
                        string += socialHistoryList[i];
                        debugger
                        if (i === socialHistoryList.length - 1) {
                            break;
                        }
                        if (i === socialHistoryList.length - 2) {
                            string += " and ";
                        }
                        else {
                            string += ", "
                        }
                    }

                    this.reportHTML += `
                        <br/>
                        <div>
                        <span class="paragrapgh-header">Social History</span>
                        <br/>
                        <ul>
                            <li>
                            	The patient uses ${string}.
                            </li>
                        </ul>

                        </div>
                        <br/>
                        `;
                }


                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">Family History</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">Work Disability History</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                this.reportHTML += `
                <br/>
                <div>
                <span class="paragrapgh-header">Activities of Daily Living</span>
                <br/>
                <ul>
                    <li>

                    </li>
                </ul>

                </div>
                <br/>
                `;

                this.reportHTML += `    `;









                // this.reportHTML += `<span>Patien Name: ${this.currentPatientDemographic.Name}</span><br/>`;
                // this.reportHTML += `<span>Admission Date: ${this.currentPatientDemographic.CreatedDate}</span><br/>`;

                for (let i = 0; i < infoChunks.length; i++) {

                    this.reportHTML += `<h4>${infoChunks[i].title}</h4>`;
                    const value = infoChunks[i].value;
                    if (value.templateValue) {
                        this.reportHTML += `<span>`;
                        for (let j = 0; j < value.templateValue.length; j++) {
                            this.reportHTML += value.templateValue[j].value + " ";

                        }
                        this.reportHTML += `</span>`;
                    }
                    else {
                        for (var key in value) {

                            if (value.hasOwnProperty(key)) {
                                this.reportHTML += `<span>${key}: ${value[key]}</span><br/>`;
                            }
                        }

                    }

                }
            }


        })
        // let currentPatientDemographicId = self.currentPatientAdmission.patientDemographicId;
        // let currentPatientDemographic = dataService.read(TableNames.patientDemographic)[0];
        // let doc = new jsPDF();
        // doc.text(20, 20, 'Tobacco report');
        // doc.text(20, 40, "Patient Name: " + currentPatientDemographic.firstName + " " + currentPatientDemographic.firstName);
        // let patientAdmissions = self.dataService.read(TableNames.admission).filter((a) => a.patientDemographicId === currentPatientDemographicId);
        // let y = 60;
        // for (let i = 0; i < patientAdmissions.length; i++) {
        //     let patientAdmission = patientAdmissions[i];
        //     doc.text(20, y, 'Admission date: ' + patientAdmission.createdDate);
        //     let admissionData = JSON.parse(patientAdmission.admissionData);
        //     let tobaccoHistory = admissionData.patientData.historyAndPhysical.patientHistory.tobacoHistory;
        //     y += 10;
        //     doc.text(20, y, 'Tobacco status: ' + tobaccoHistory.tobaccoStatus);
        //     y += 10;
        //     doc.text(20, y, 'Tobacco Type: ' + tobaccoHistory.tobaccoType);

        //     y += 10;
        //     doc.text(20, y, 'Tobacco Amount: ' + tobaccoHistory.tobaccoAmount);

        //     y += 20;
        // }

        // // Save the PDF
        // doc.save('Tobacco report.pdf');



        // this.currentPatientAdmission.AdmissionData = JSON.stringify(this.currentPatientAdmissionData);
        // this.dataService.update(TableNames.admission, this.currentPatientAdmission)
        //     .then(result => {
        //         console.log("Appointment was updated")
        //     })
        //     .catch(error => console.log(error))

    }

    exportReportAsPdf() {
        let css2pdf = window['xepOnline'];

        let node = document.createElement('div');
        node.className = 'report-pdf';

        let parent = this.report.nativeElement.parentElement;
        parent.appendChild(node);

        node.appendChild(this.report.nativeElement);
        node.id = 'report-pdf'

        const pdf = css2pdf.Formatter.Format('report-pdf',
            {
                render: 'download',
                filename: this.reportName + ' ' + this.currentPatientDemographic.Name + ' ' + this.currentPatientDemographic.CreatedDate
            });

        parent.appendChild(this.report.nativeElement);
        node.remove();

        return pdf
    }
}
