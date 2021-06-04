using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IAlcoholHistoryService
    {
        Task<IEnumerable<AlcoholHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<AlcoholHistoryViewModel> GetById(Guid id);

        Task<AlcoholHistoryViewModel> GetLastCreatedByPatientId(Guid patientId);

        Task<AlcoholHistoryViewModel> Create(AlcoholHistoryViewModel alcoholHistoryViewModel);

        Task<AlcoholHistoryViewModel> Update(AlcoholHistoryViewModel alcoholHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<AlcoholHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<AlcoholHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}