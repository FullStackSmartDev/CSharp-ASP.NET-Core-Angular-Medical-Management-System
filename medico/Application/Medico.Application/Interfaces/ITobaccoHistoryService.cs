
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface ITobaccoHistoryService
    {
        Task<IEnumerable<TobaccoHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<TobaccoHistoryViewModel> GetById(Guid id);

        Task<TobaccoHistoryViewModel> GetLastCreatedByPatientId(Guid patientId);

        Task<TobaccoHistoryViewModel> Create(TobaccoHistoryViewModel tobaccoHistoryViewModel);

        Task<TobaccoHistoryViewModel> Update(TobaccoHistoryViewModel tobaccoHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<TobaccoHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<TobaccoHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}