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
    public class TobaccoHistoryService : BaseDeletableByIdService<TobaccoHistory, TobaccoHistoryViewModel>,
        ITobaccoHistoryService
    {
        public TobaccoHistoryService(ITobaccoHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<TobaccoHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<TobaccoHistoryViewModel>()
                .ToListAsync();

            return tobaccoHistory;
        }

        public async Task<TobaccoHistoryViewModel> GetLastCreatedByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .OrderByDescending(h => h.CreateDate)
                .FirstOrDefaultAsync();

            return tobaccoHistory == null
                ? null
                : Mapper.Map<TobaccoHistoryViewModel>(tobaccoHistory);
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<TobaccoHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<TobaccoHistoryViewModel>();
        }

        public async Task<IEnumerable<TobaccoHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientTobaccoHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<TobaccoHistoryViewModel>()
                .ToListAsync();

            return patientTobaccoHistory;
        }
    }
}