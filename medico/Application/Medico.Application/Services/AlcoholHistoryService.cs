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
    public class AlcoholHistoryService : BaseDeletableByIdService<AlcoholHistory, AlcoholHistoryViewModel>,
        IAlcoholHistoryService
    {
        public AlcoholHistoryService(IAlcoholHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<AlcoholHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<AlcoholHistoryViewModel>()
                .ToListAsync();

            return tobaccoHistory;
        }

        public async Task<AlcoholHistoryViewModel> GetLastCreatedByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .OrderByDescending(h => h.CreateDate)
                .FirstOrDefaultAsync();

            return tobaccoHistory == null
                ? null
                : Mapper.Map<AlcoholHistoryViewModel>(tobaccoHistory);
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<AlcoholHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<AlcoholHistoryViewModel>();
        }

        public async Task<IEnumerable<AlcoholHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var alcoholDrugHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<AlcoholHistoryViewModel>()
                .ToListAsync();

            return alcoholDrugHistory;
        }
    }
}