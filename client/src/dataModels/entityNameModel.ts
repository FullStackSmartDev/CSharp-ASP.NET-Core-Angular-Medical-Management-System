import { BaseEntityModel } from "./baseEntityModel";

export abstract class EntityNameModel extends BaseEntityModel {
    Name: string;
    Title: string;

    constructor(id: string = "", isDelete: boolean = false) {
        super(id, isDelete);
        this.Name = "";
        this.Title = "";
    }
}