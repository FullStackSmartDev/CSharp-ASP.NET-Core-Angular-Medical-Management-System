using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface ISurgicalHistoryService
    {
        Task<IEnumerable<SurgicalHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<SurgicalHistoryViewModel> GetById(Guid id);

        Task<bool> IsHistoryExist(Guid patientId);

        Task<SurgicalHistoryViewModel> Create(SurgicalHistoryViewModel surgicalHistoryViewModel);

        Task<SurgicalHistoryViewModel> Update(SurgicalHistoryViewModel surgicalHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<SurgicalHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<SurgicalHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}
