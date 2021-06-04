import { GuidHelper } from 'src/app/_helpers/guid.helper';

export class ReportDataTreeNode {
    patientChartNodeId: string;
    html: string;
    childrenNodes: ReportDataTreeNode[];

    constructor(patientChartNodeId: string = GuidHelper.generateNewGuid(), html: string = "",
        childrenNodes: ReportDataTreeNode[] = []) {
        this.patientChartNodeId = patientChartNodeId;
        this.html = html;
        this.childrenNodes = childrenNodes;
    }
}