import { PatientChartNode } from 'src/app/_models/patientChartNode';
import { PatientChartNodeManagementService } from './patient-chart-node-management.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientChartAdminNode } from 'src/app/administration/classes/patientChartAdminNode';
import { PatientChartNodeChanges } from 'src/app/administration/classes/patientChartNodeChanges';
import { GuidHelper } from 'src/app/_helpers/guid.helper';
import { SortableItem } from 'src/app/share/classes/sortableItem';
import { BasePatientChartHttpService } from 'src/app/_services/base-patient-chart-http.service';
import { PatientChartNodeType } from 'src/app/_models/patientChartNodeType';

export class PatientChartNodeService {
    private _patientChart: BehaviorSubject<PatientChartNode>;

    private get patientChartValue(): PatientChartNode {
        return this._patientChart.value;
    }

    constructor(patientChartRootNode: PatientChartNode,
        private patientChartNodeManagementService: PatientChartNodeManagementService,
        private patientChartHttpService: BasePatientChartHttpService) {
        this._patientChart =
            new BehaviorSubject<PatientChartNode>(patientChartRootNode);
    }

    get adminPatientChart(): Observable<PatientChartNode> {
        return this._patientChart.asObservable();
    }

    refreshPatientChart(companyId: string) {
        this.patientChartHttpService.get(companyId)
            .then(patientChart => {
                this._patientChart.next(patientChart);
            });
    }

    activatePatientChartNode(patientChartAdminNode: PatientChartAdminNode, companyId: string) {
        const nodeId = patientChartAdminNode.id;

        const patientChartNode =
            this.patientChartNodeManagementService
                .firstOrDefaultNode(this.patientChartValue, (node: PatientChartNode) => node.id === nodeId);

        this.patientChartNodeManagementService
            .recursiveFromTopToBottomForeach(patientChartNode, (node: PatientChartNode) => { node.attributes.isActive = true; });

        //we have to activate all parent nodes if child node is activated
        this.patientChartNodeManagementService
            .recursiveFromBottomToTopForeach(this.patientChartValue, patientChartNode, (node: PatientChartNode) => { node.attributes.isActive = true; });

        const patientChartDocumentNodeId =
            this.getPatientChartDocumentId(patientChartNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    deactivatePatientChartNode(patientChartAdminNode: PatientChartAdminNode, companyId: string) {
        const nodeId = patientChartAdminNode.id;

        const patientChartNode =
            this.patientChartNodeManagementService
                .firstOrDefaultNode(this.patientChartValue, (node: PatientChartNode) => node.id === nodeId);

        this.patientChartNodeManagementService
            .recursiveFromTopToBottomForeach(patientChartNode, (node: PatientChartNode) => { node.attributes.isActive = false; });

        const patientChartDocumentNodeId =
            this.getPatientChartDocumentId(patientChartNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    updatePatientChartNode(patientChartNodeChanges: PatientChartNodeChanges, companyId: string) {
        const nodeId = patientChartNodeChanges.nodeId;

        const patientChartNode =
            this.patientChartNodeManagementService
                .firstOrDefaultNode(this.patientChartValue, (node: PatientChartNode) => node.id === nodeId);

        const changes = patientChartNodeChanges.changes;

        for (let changedPropertyName in changes) {
            patientChartNode[changedPropertyName] = changes[changedPropertyName];
        }

        const patientChartDocumentNodeId =
            this.getPatientChartDocumentId(patientChartNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    addPatientChartNode(patientChartNode: PatientChartNode, companyId: string) {
        const parentId = patientChartNode.parentId;

        const parentPatientChartNode = this.patientChartNodeManagementService
            .firstOrDefaultNode(this.patientChartValue, (node: PatientChartNode) => node.id === parentId);

        if (!parentPatientChartNode.children)
            parentPatientChartNode.children = [];

        const newPatientChartNodeOrder =
            parentPatientChartNode.children.length + 1

        patientChartNode.attributes.order = newPatientChartNodeOrder;

        parentPatientChartNode.children.push(patientChartNode);

        const patientChartDocumentNodeId =
            this.getPatientChartDocumentId(parentPatientChartNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    reorderPatientChartChildrenNodes(patientChartNodeParentId: string, newChildrenNodesOrders: SortableItem[], companyId: string) {
        const patientChartParentNode =
            this.patientChartNodeManagementService
                .firstOrDefaultNode(this.patientChartValue, (node: PatientChartNode) => node.id === patientChartNodeParentId);

        const patientChartNodeChildren = patientChartParentNode.children;

        patientChartNodeChildren.forEach((patientChartNodeChild) => {
            const patientChartNodeChildId = patientChartNodeChild.id;

            const newOrder = newChildrenNodesOrders
                .find(childNodeOrder => childNodeOrder.id === patientChartNodeChildId)
                .order;

            patientChartNodeChild.attributes.order = newOrder;
        });

        //apply ascending order to patient chart children nodes
        patientChartNodeChildren.sort((patientChartNodeChild1, patientChartNodeChild2) =>
            patientChartNodeChild1.attributes.order - patientChartNodeChild2.attributes.order);

        let patientChartDocumentNodeId =
            this.getPatientChartDocumentIdOnReorderAction(patientChartParentNode, PatientChartNodeType.RootNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    deletePatientChartNode(nodeId: string, parentNodeId: string, companyId: string) {
        const parentChartNode =
            this.patientChartNodeManagementService
                .firstOrDefaultNode(this.patientChartValue, (node: PatientChartNode) => node.id === parentNodeId);

        const parentChartNodeChildren = parentChartNode.children;

        const childNodeIndex =
            parentChartNodeChildren.findIndex(child => child.id === nodeId);

        parentChartNodeChildren.splice(childNodeIndex, 1);

        if (parentChartNodeChildren.length) {
            //decreasing order of the rest child nodes
            parentChartNodeChildren
                .filter(childNode => childNode.attributes.order > childNodeIndex + 1)
                .forEach(childNode => childNode.attributes.order = childNode.attributes.order - 1);
        }

        const patientChartDocumentNodeId =
            this.getPatientChartDocumentId(parentChartNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    copyPastePatientChartNode(patientChartNodeIdToCopy: string,
        parentPatientChartNodeId: string, companyId: string) {

        const patientChartNodeToCopy = this.patientChartNodeManagementService
            .firstOrDefaultNode(this.patientChartValue,
                (node: PatientChartNode) => node.id === patientChartNodeIdToCopy);

        const patientChartNodeToCopyJsonString =
            JSON.stringify(patientChartNodeToCopy);

        const patientChartNodeCopy: PatientChartNode = JSON.parse(patientChartNodeToCopyJsonString);

        patientChartNodeCopy.id = GuidHelper.generateNewGuid();

        const parentPatientChartNode = this.patientChartNodeManagementService
            .firstOrDefaultNode(this.patientChartValue,
                (node: PatientChartNode) => node.id === parentPatientChartNodeId);

        patientChartNodeCopy.attributes.order = parentPatientChartNode.children.length + 1;
        patientChartNodeCopy.attributes.isPredefined = false;
        patientChartNodeCopy.parentId = parentPatientChartNode.id;

        parentPatientChartNode.children.push(patientChartNodeCopy);

        const patientChartDocumentNodeId =
            this.getPatientChartDocumentId(parentPatientChartNode, companyId);

        this.patientChartHttpService.update(this.patientChartValue, companyId, patientChartDocumentNodeId)
            .then((patientChart) => this._patientChart.next(patientChart));
    }

    private getPatientChartDocumentIdOnReorderAction(patientChartParentNode: PatientChartNode,
        excludedNodeType: PatientChartNodeType, companyId: string): string {
        let patientChartDocumentNodeId = null;
        if (patientChartParentNode.type !== excludedNodeType && !companyId) {
            patientChartDocumentNodeId = this.patientChartNodeManagementService
                .getPatientChartDocumentNodeId(this.patientChartValue, patientChartParentNode.id);
        }

        return patientChartDocumentNodeId;
    }

    private getPatientChartDocumentId(patientChartParentNode: PatientChartNode, companyId: string): string {
        let patientChartDocumentNodeId = null;

        if (!companyId) {
            const parentPatientChartNodeType = patientChartParentNode.type;

            patientChartDocumentNodeId = parentPatientChartNodeType === PatientChartNodeType.DocumentNode
                ? patientChartParentNode.id
                : this.patientChartNodeManagementService
                    .getPatientChartDocumentNodeId(this.patientChartValue, patientChartParentNode.id);
        }

        return patientChartDocumentNodeId;
    }
}
