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
    public class DrugHistoryService : BaseDeletableByIdService<DrugHistory, DrugHistoryViewModel>,
        IDrugHistoryService
    {
        public DrugHistoryService(IDrugHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<DrugHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var drugHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<DrugHistoryViewModel>()
                .ToListAsync();

            return drugHistory;
        }

        public async Task<DrugHistoryViewModel> GetLastCreatedByPatientId(Guid patientId)
        {
            var drugHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .OrderByDescending(h => h.CreateDate)
                .FirstOrDefaultAsync();

            return drugHistory == null
                ? null
                : Mapper.Map<DrugHistoryViewModel>(drugHistory);
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<DrugHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<DrugHistoryViewModel>();
        }

        public async Task<IEnumerable<DrugHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientDrugHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<DrugHistoryViewModel>()
                .ToListAsync();

            return patientDrugHistory;
        }
    }
}
