import { Injectable } from '@angular/core';
import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

@Injectable()
export class PatientChartNodeFiltersService {
    getByNodeNameFilter(nodeName: string): (patientChartNode: PatientChartNode) => boolean {
        return (patientChartNode) => patientChartNode.name === nodeName;
    }

    getByNodeTypeFilter(nodeType: PatientChartNodeType): (patientChartNode: PatientChartNode) => boolean {
        return (patientChartNode) => patientChartNode.type === nodeType;
    }

    getByNodeIdFilter(nodeId: string): (patientChartNode: PatientChartNode) => boolean {
        return (patientChartNode) => patientChartNode.id === nodeId;
    }
}