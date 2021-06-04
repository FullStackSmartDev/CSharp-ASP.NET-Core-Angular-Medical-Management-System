import { Injectable } from '@angular/core';
import { DataService } from './dataService';
import { TableNames } from '../constants/tableNames';

@Injectable()
export class ReportGeneratorService {

    constructor(private dataService: DataService) { }

    CreateReport(appoinmentId: string, patientDataModelTree: Array<any>): Promise<any[]> {
        const promise = this.dataService.getAll(TableNames.admission, true).then(results => {
            
            let admission = results.filter(r => r.AppointmentId === appoinmentId)[0];
            let data = JSON.parse(admission.AdmissionData).patientRoot;
            let reportInfoChunks = [];

            listNecessaryInfoRecursive(patientDataModelTree[0], data.children[2]);
            return reportInfoChunks;

            function listNecessaryInfoRecursive(treeNode: any, node: any) {
                if(treeNode.items.length == 0){
                    if (treeNode.checked && Object.keys(node.value).length !== 0) {
                        reportInfoChunks.push(node);
                    }
                }
                else{
                    for (let i = 0; i < treeNode.items.length; i++) {
                        listNecessaryInfoRecursive(treeNode.items[i], node.children[i]);  
                    }
                }
            }
        });

        return promise;
    }
}