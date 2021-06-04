export class Room {
    id: string;
    locationId: string;
    name: string;
    isActive: boolean;

    constructor() {
        this.isActive = true;
    }
}