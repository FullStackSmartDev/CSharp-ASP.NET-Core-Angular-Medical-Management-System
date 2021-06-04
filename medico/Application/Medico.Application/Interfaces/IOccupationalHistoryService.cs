using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IOccupationalHistoryService
    {
        Task<IEnumerable<OccupationalHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<OccupationalHistoryViewModel> GetById(Guid id);

        Task<bool> IsHistoryExist(Guid patientId);

        Task<OccupationalHistoryViewModel> Create(OccupationalHistoryViewModel occupationalHistoryViewModel);

        Task<OccupationalHistoryViewModel> Update(OccupationalHistoryViewModel occupationalHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<OccupationalHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<OccupationalHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}