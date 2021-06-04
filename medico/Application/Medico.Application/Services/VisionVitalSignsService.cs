using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class VisionVitalSignsService : BaseDeletableByIdService<VisionVitalSigns, VisionVitalSignsViewModel>,
        IVisionVitalSignsService
    {
        public VisionVitalSignsService(IVisionVitalSignsRepository repository,
            IMapper mapper) : base(repository, mapper)
        {
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public async Task<List<VisionVitalSignsViewModel>> GetByPatientId(Guid patientId)
        {
            return await Repository.GetAll()
                .Where(bvs => bvs.PatientId == patientId)
                .ProjectTo<VisionVitalSignsViewModel>()
                .ToListAsync();
        }

        public IQueryable<VisionVitalSignsViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<VisionVitalSignsViewModel>();
        }
    }
}
