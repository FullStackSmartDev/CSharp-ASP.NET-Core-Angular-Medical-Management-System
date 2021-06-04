using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IDrugHistoryService
    {
        Task<IEnumerable<DrugHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<DrugHistoryViewModel> GetById(Guid id);

        Task<DrugHistoryViewModel> GetLastCreatedByPatientId(Guid patientId);

        Task<DrugHistoryViewModel> Create(DrugHistoryViewModel drugHistoryViewModel);

        Task<DrugHistoryViewModel> Update(DrugHistoryViewModel drugHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<DrugHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<DrugHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}
