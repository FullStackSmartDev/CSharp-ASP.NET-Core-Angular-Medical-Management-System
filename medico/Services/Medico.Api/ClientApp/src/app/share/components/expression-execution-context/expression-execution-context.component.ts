import { Component } from "@angular/core";
import { ExpressionExecutionContextsService } from 'src/app/_services/expression-execution-contexts.service';
import { ExpressionTestExecutionContext } from 'src/app/_models/expressionTestExecutionContext';

@Component({
    selector: "expression-execution-context",
    templateUrl: "./expression-execution-context.component.html"
})

export class ExpressionExecutionContextComponent {
    expressionExecutionContext: ExpressionTestExecutionContext;

    constructor(expressionExecutionContextsService: ExpressionExecutionContextsService) {
        expressionExecutionContextsService
            .getExpressionTestExecutionContext()
            .then(expressionExecutionContext => this.expressionExecutionContext = expressionExecutionContext);
    }
}