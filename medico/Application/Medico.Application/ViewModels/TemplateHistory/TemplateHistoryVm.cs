using System;

namespace Medico.Application.ViewModels.TemplateHistory
{
    public class TemplateHistoryVm
    {
        public DateTime? CreatedDate { get; private set; }

        public string DetailedContent { get; private set; }

        public static TemplateHistoryVm Empty => new TemplateHistoryVm();

        public static TemplateHistoryVm Create(DateTime createDate, string detailedContent)
        {
            return new TemplateHistoryVm
            {
                CreatedDate = createDate,
                DetailedContent = detailedContent
            };
        }
    }
}