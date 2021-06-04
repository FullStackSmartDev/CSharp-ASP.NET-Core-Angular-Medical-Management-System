import { ReferenceTableGridItem } from './referenceTableGridItem';

export class ReferenceTable extends ReferenceTableGridItem {
    data: ReferenceTableData;
}

export class ReferenceTableData {
    header: ReferenceTableHeaderColumn[];
    body: any[];
}

export class ReferenceTableHeaderColumn {
    title: string;
    type: string;
    visible: boolean;
}