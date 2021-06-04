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
    public class OccupationalHistoryService : BaseDeletableByIdService<OccupationalHistory, OccupationalHistoryViewModel>,
        IOccupationalHistoryService
    {
        public OccupationalHistoryService(IOccupationalHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<OccupationalHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var occupationalHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<OccupationalHistoryViewModel>()
                .ToListAsync();

            return occupationalHistory;
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var occupationalHistory = await Repository.GetAll()
                .FirstOrDefaultAsync(h => h.PatientId == patientId);

            return occupationalHistory != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<OccupationalHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<OccupationalHistoryViewModel>();
        }

        public async Task<IEnumerable<OccupationalHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientOccupationalHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<OccupationalHistoryViewModel>()
                .ToListAsync();

            return patientOccupationalHistory;
        }
    }
}