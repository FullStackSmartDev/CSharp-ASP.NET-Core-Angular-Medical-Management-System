export class AllegationsNotesStatus {
    id: string;
    admissionId: string;
    isReviewed: boolean;

    constructor(admissionId: string = "", isReviewed: boolean = false) {
        this.admissionId = admissionId;
        this.isReviewed = isReviewed;
    }
}