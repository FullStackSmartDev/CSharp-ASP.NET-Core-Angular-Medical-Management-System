import { ExpressionGridItemModel } from './expressionGridItemModel';
import { CreateUpdateExpressionModel } from './createUpdateExpressionModel';

export class ExpressionModel extends ExpressionGridItemModel {
    template: string;

    static convertToCreateUpdateExpressionModel(expression: ExpressionModel): CreateUpdateExpressionModel {
        const createUpdateExpressionModel =
            new CreateUpdateExpressionModel();

        createUpdateExpressionModel.id = expression.id;
        createUpdateExpressionModel.title = expression.title;
        createUpdateExpressionModel.companyId = expression.companyId;
        createUpdateExpressionModel.version = expression.version;
        createUpdateExpressionModel.libraryExpressionId = expression.libraryExpressionId;
        createUpdateExpressionModel.template = expression.template;
        
        return createUpdateExpressionModel;
    }
} 