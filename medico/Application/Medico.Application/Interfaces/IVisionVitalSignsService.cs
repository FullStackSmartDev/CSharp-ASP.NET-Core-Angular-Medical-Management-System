using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IVisionVitalSignsService
    {
        Task<VisionVitalSignsViewModel> GetById(Guid id);

        Task Delete(Guid id);

        Task<List<VisionVitalSignsViewModel>> GetByPatientId(Guid patientId);

        Task<VisionVitalSignsViewModel> Create(VisionVitalSignsViewModel visionVitalSignsViewModel);

        Task<VisionVitalSignsViewModel> Update(VisionVitalSignsViewModel visionVitalSignsViewModel);

        IQueryable<VisionVitalSignsViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel);
    }
}
