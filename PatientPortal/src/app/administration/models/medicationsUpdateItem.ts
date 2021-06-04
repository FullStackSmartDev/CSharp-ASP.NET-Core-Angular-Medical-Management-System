import { MedicationUpdateStatus } from './medicationUpdateStatus';

export class MedicationsUpdateItem {
    id: string;
    date: any;
    status: MedicationUpdateStatus
    medicationsFilePath: string;
    medicationsFileName: string;
    error: string;
}