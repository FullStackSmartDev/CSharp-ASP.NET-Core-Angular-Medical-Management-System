using System;
using System.Threading.Tasks;
using Medico.Application.ViewModels.TemplateHistory;

namespace Medico.Application.Interfaces
{
    public interface ITemplateHistoryService
    {
        Task<TemplateHistoryVm> GetPreviousDetailedTemplateContent(Guid admissionId, Guid templateId, Guid patientId);
    }
}