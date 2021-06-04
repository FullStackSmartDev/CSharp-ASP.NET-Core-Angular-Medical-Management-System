using System;
using System.Collections.Generic;

namespace Medico.Application.ViewModels.Template
{
    public class TemplatesOrdersVm
    {
        public Guid CompanyId { get; set; }

        public TemplatesOrdersVm()
        {
            TemplatesOrders =
                new List<TemplateOrderVm>();
        }

        public List<TemplateOrderVm> TemplatesOrders { get; set; }
    }
}
