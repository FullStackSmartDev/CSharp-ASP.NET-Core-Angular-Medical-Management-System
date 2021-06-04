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
    public class FamilyHistoryService : BaseDeletableByIdService<FamilyHistory, FamilyHistoryViewModel>,
        IFamilyHistoryService
    {
        public FamilyHistoryService(IFamilyHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<FamilyHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var familyHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<FamilyHistoryViewModel>()
                .ToListAsync();

            return familyHistory;
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var familyHistory = await Repository.GetAll()
                .FirstOrDefaultAsync(h => h.PatientId == patientId);

            return familyHistory != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<FamilyHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<FamilyHistoryViewModel>();
        }

        public async Task<IEnumerable<FamilyHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientFamilyHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<FamilyHistoryViewModel>()
                .ToListAsync();

            return patientFamilyHistory;
        }
    }
}