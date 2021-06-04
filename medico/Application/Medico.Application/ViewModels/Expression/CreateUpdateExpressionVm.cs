using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels.Expression
{
    public class CreateUpdateExpressionVm : ExpressionVm
    {
        public IList<Guid> ReferenceTables { get; set; }
    }
}