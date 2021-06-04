using System.Threading.Tasks;
using Medico.Application.ViewModels.ExpressionExecution;

namespace Medico.Application.Interfaces
{
    public interface IExpressionExecutionService
    {
        Task<string> CalculateExpressionsInTemplate(ExpressionExecutionRequestVm expressionExecutionRequest);
        
        Task<string> CalculateExpression(ExpressionExecutionRequestVm expressionExecutionRequest);
    }
}