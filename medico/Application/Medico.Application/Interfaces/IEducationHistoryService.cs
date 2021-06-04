using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IEducationHistoryService
    {
        Task<IEnumerable<EducationHistoryViewModel>> GetByPatientId(Guid patientId);

        Task<EducationHistoryViewModel> GetById(Guid id);

        Task<bool> IsHistoryExist(Guid patientId);

        Task<EducationHistoryViewModel> Create(EducationHistoryViewModel educationHistoryViewModel);

        Task<EducationHistoryViewModel> Update(EducationHistoryViewModel educationHistoryViewModel);

        Task Delete(Guid id);

        IQueryable<EducationHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);

        Task<IEnumerable<EducationHistoryViewModel>> GetAllByPatientId(Guid patientId);
    }
}