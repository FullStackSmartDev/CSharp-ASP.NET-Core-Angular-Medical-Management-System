import { Component, Input, OnInit } from "@angular/core";
import { ExpressionExecutionService } from 'src/app/_services/expression-execution.service';
import { ExpressionExecutionRequest } from 'src/app/_models/expression-execution-request';
import { ExpressionTestEntityIds } from 'src/app/_classes/expressionTestEntityIds';
import { LookupModel } from 'src/app/_models/lookupModel';

@Component({
    selector: "expression-execution-result",
    templateUrl: "./expression-execution-result.component.html"
})

export class ExpressionExecutionResultComponent implements OnInit {
    @Input() expressionTemplate: string;
    @Input() referenceTables: LookupModel[];

    expressionResult: string = "";

    constructor(private expressionExecutionService: ExpressionExecutionService) {
    }

    ngOnInit() {
        if (!this.expressionTemplate)
            return;

        const expressionExecutionRequest = new ExpressionExecutionRequest();

        expressionExecutionRequest.admissionId = ExpressionTestEntityIds.admissionId;
        expressionExecutionRequest.detailedTemplateContent = this.expressionTemplate;

        if (this.referenceTables && this.referenceTables.length)
            expressionExecutionRequest.referenceTableIds = this.referenceTables.map(t => t.id);

        this.expressionExecutionService.calculateExpression(expressionExecutionRequest)
            .then(expressionResult => this.expressionResult = expressionResult);
    }
}