import { Injectable } from "@angular/core";
import { TemplateLookupItemTrackerViewDataService } from "./dataServices/read/readDataServices";
import { TemplateLookupItemDataService, TemplateLookupItemTrackerDataService } from "./dataServices/readCreateUpdate/readCreateUpdateDataServices";
import { TemplateLookupItemTracker } from "../dataModels/templateLookupItemTracker";

@Injectable()
export class TemplateLookupItemTrackersUpdateService {

    constructor(private templateLookupItemTrackerViewDataService: TemplateLookupItemTrackerViewDataService,
        private templateLookupItemDataService: TemplateLookupItemDataService,
        private templateLookupItemTrackerDataService: TemplateLookupItemTrackerDataService) {
    }

    update(templateId: string, detailedTemplateContent: string): Promise<any> {
        return this.getTemplateLookupItems(templateId)
            .then(templateSelectableItems => {

                const templateSelectableItemsObject =
                    this.getTemplateSelectableItemsObject(templateSelectableItems);

                const newTemplateSelectableItemsObject =
                    this.getNewTemplateSelectableItemsObject(detailedTemplateContent);


                const createTrackersPromise =
                    this.createNewTemplateLookupItemTrackers(templateId, templateSelectableItemsObject, newTemplateSelectableItemsObject);

                const updateTrackersPromise =
                    this.updateTemplateLookupItemTrackers(templateId,
                        templateSelectableItemsObject,
                        newTemplateSelectableItemsObject,
                        templateSelectableItems);

                const deleteTrackersPromise =
                    this.deleteTemplateLookupItemTrackers(templateId,
                        templateSelectableItemsObject,
                        newTemplateSelectableItemsObject,
                        templateSelectableItems);

                const templateLookupItemTrackersPromises = [
                    createTrackersPromise,
                    updateTrackersPromise,
                    deleteTrackersPromise
                ];

                return Promise.all(templateLookupItemTrackersPromises);

            });
    }

    private deleteTemplateLookupItemTrackers(templateId: string,
        templateSelectableItemsObject: any,
        newTemplateSelectableItemsObject: any,
        templateSelectableItems: any[]): Promise<any> {

        const deleteTemplateLookupItemTrackersPromises = [];

        for (const lookupItemName in templateSelectableItemsObject) {
            if (!newTemplateSelectableItemsObject[lookupItemName]) {
                const templateLookupItemTracker =
                    new TemplateLookupItemTracker();

                templateLookupItemTracker.TemplateId = templateId;

                const templateLookupItemId =
                    templateSelectableItems.filter(t => t.Name === lookupItemName)[0].Id;
                templateLookupItemTracker.TemplateLookupItemId = templateLookupItemId;

                templateLookupItemTracker.NumberOfLookupItemsInTemplate =
                    newTemplateSelectableItemsObject[lookupItemName];

                const whereSqlStatement = `WHERE TemplateLookupItemId = '${templateLookupItemId}' AND TemplateId = '${templateId}'`;

                const deletePromise =
                    this.templateLookupItemTrackerDataService.delete(whereSqlStatement, templateLookupItemTracker);

                deleteTemplateLookupItemTrackersPromises.push(deletePromise);
            }
        }

        return Promise.all(deleteTemplateLookupItemTrackersPromises);
    }

    private updateTemplateLookupItemTrackers(templateId: string,
        templateSelectableItemsObject: any,
        newTemplateSelectableItemsObject: any,
        templateSelectableItems: any[]): Promise<any> {

        const updateTemplateLookupItemTrackersPromises = [];

        for (const lookupItemName in templateSelectableItemsObject) {
            if (newTemplateSelectableItemsObject[lookupItemName] &&
                newTemplateSelectableItemsObject[lookupItemName] !== templateSelectableItemsObject[lookupItemName]) {
                const templateLookupItemTracker =
                    new TemplateLookupItemTracker();

                templateLookupItemTracker.TemplateId = templateId;

                const templateLookupItemId =
                    templateSelectableItems.filter(t => t.Name === lookupItemName)[0].Id;
                templateLookupItemTracker.TemplateLookupItemId = templateLookupItemId;

                templateLookupItemTracker.NumberOfLookupItemsInTemplate =
                    newTemplateSelectableItemsObject[lookupItemName];

                const filter = [
                    ["TemplateId", "=", templateId],
                    "and",
                    ["TemplateLookupItemId", "=", templateLookupItemId]
                ]

                const updatePromise =
                    this.templateLookupItemTrackerDataService.update(templateLookupItemTracker, filter);

                updateTemplateLookupItemTrackersPromises.push(updatePromise);
            }
        }

        return Promise.all(updateTemplateLookupItemTrackersPromises);
    }

    private createNewTemplateLookupItemTrackers(templateId: string,
        templateSelectableItemsObject: any, newTemplateSelectableItemsObject: any): Promise<any> {

        const newLookupItemNames = [];

        for (const lookupItemName in newTemplateSelectableItemsObject) {
            if (!templateSelectableItemsObject[lookupItemName]) {
                newLookupItemNames.push(lookupItemName);
            }
        }

        if (!newLookupItemNames.length) {
            return Promise.resolve();
        }

        const getLookupItemPromises = [];

        for (let i = 0; i < newLookupItemNames.length; i++) {
            const newLookupItemName = newLookupItemNames[i];

            const loadOptions = {
                filter: ["Name", "=", newLookupItemName]
            };

            const lookupItemFirstOrDefaultPromise =
                this.templateLookupItemDataService.firstOrDefault(loadOptions);

            getLookupItemPromises.push(lookupItemFirstOrDefaultPromise);
        }

        return Promise.all(getLookupItemPromises)
            .then(lookupItems => {
                const createTemplateLookupItemTrackerPromises = [];

                for (let i = 0; i < lookupItems.length; i++) {
                    const lookupItem = lookupItems[i];

                    const templateLookupItemTracker =
                        new TemplateLookupItemTracker();

                    templateLookupItemTracker.TemplateId = templateId;
                    templateLookupItemTracker.TemplateLookupItemId = lookupItem.Id;
                    templateLookupItemTracker.NumberOfLookupItemsInTemplate =
                        newTemplateSelectableItemsObject[lookupItem.Name];

                    const createPromise =
                        this.templateLookupItemTrackerDataService.create(templateLookupItemTracker);

                    createTemplateLookupItemTrackerPromises
                        .push(createPromise);
                }

                return Promise.all(createTemplateLookupItemTrackerPromises);

            });
    }

    private getNewTemplateSelectableItemsObject(detailedTemplateContent: string): any {
        const currentNotFormattedSelectableItems = detailedTemplateContent
            .match(/>#[a-z,A-Z,_]+\.[a-z,A-Z,_]+#</g);

        const newTemplateSelectableItemsObject = {};

        if (currentNotFormattedSelectableItems
            && currentNotFormattedSelectableItems.length > 0) {

            currentNotFormattedSelectableItems.forEach(s => {
                const selectableItemName =
                    s.split(".")[1].slice(0, -2);

                if (newTemplateSelectableItemsObject[selectableItemName]) {
                    newTemplateSelectableItemsObject[selectableItemName] += 1;
                }
                else {
                    newTemplateSelectableItemsObject[selectableItemName] = 1;
                }
            });
        }

        return newTemplateSelectableItemsObject;
    }

    private getTemplateSelectableItemsObject(templateSelectableItems: any[]): any {
        const templateSelectableItemsObject = {};

        templateSelectableItems.forEach(s => {
            const selectableItemName = s.Name;
            const numberOfLookupItemsInTemplate = s.NumberOfLookupItemsInTemplate;

            templateSelectableItemsObject[selectableItemName] = numberOfLookupItemsInTemplate;
        });

        return templateSelectableItemsObject;
    }

    private getTemplateLookupItems(templateId: string): Promise<any[]> {
        const loadOptions = {
            filter: ["TemplateId", "=", templateId]
        };

        return this.templateLookupItemTrackerViewDataService
            .search(loadOptions)
    }
}