using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IFamilyHistoryService
    {
        Task<IEnumerable<FamilyHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<FamilyHistoryViewModel> GetById(Guid id);

        Task<bool> IsHistoryExist(Guid patientId);

        Task<FamilyHistoryViewModel> Create(FamilyHistoryViewModel familyHistoryViewModel);

        Task<FamilyHistoryViewModel> Update(FamilyHistoryViewModel familyHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<FamilyHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<FamilyHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}