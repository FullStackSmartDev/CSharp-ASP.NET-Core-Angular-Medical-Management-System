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
    public class SurgicalHistoryService : BaseDeletableByIdService<SurgicalHistory, SurgicalHistoryViewModel>,
        ISurgicalHistoryService
    {
        public SurgicalHistoryService(ISurgicalHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<SurgicalHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<SurgicalHistoryViewModel>()
                .ToListAsync();

            return tobaccoHistory;
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .FirstOrDefaultAsync(h => h.PatientId == patientId);

            return tobaccoHistory != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<SurgicalHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<SurgicalHistoryViewModel>();
        }

        public async Task<IEnumerable<SurgicalHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientSurgicalHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<SurgicalHistoryViewModel>()
                .ToListAsync();

            return patientSurgicalHistory;
        }
    }
}