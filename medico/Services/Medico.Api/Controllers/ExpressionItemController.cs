using System;
using System.Threading.Tasks;
using Medico.Application.ExpressionItemsManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/expression-items")]
    public class ExpressionItemController : ControllerBase
    {
        private readonly IExpressionItemsService _expressionItemsService;

        public ExpressionItemController(IExpressionItemsService expressionItemsService)
        {
            _expressionItemsService = expressionItemsService;
        }

        [Authorize]
        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var expressionItemHtmlString = await _expressionItemsService
                .GetExpressionItemHtmlElement(id);
            return Ok(new {expressionItemHtmlString});
        }
    }
}