import { BaseEntityActiveModel } from "./baseEntityModel";

export class Room extends BaseEntityActiveModel {
    LocationId: string;
    Name: string;

    constructor(id: string = "", isActive: boolean = true) {
        super(id, isActive);

        this.LocationId = "";
        this.Name = "";
    }

    createFromEntityModel(entity: any) {
        const newRoom = new Room(entity.Id, !!entity.IsActive);

        newRoom.LocationId = entity.LocationId;
        newRoom.Name = entity.Name;

        return newRoom;
    }
}