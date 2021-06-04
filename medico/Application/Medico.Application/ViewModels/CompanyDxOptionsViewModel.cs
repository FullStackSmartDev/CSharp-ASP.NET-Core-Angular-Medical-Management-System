using System;
using DevExtreme.AspNet.Data;

namespace Medico.Application.ViewModels
{
    public class CompanyDxOptionsViewModel : DataSourceLoadOptionsBase
    {
        public Guid CompanyId { get; set; }
    }
}