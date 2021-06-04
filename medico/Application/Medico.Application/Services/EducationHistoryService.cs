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
    public class EducationHistoryService : BaseDeletableByIdService<EducationHistory, EducationHistoryViewModel>,
        IEducationHistoryService
    {
        public EducationHistoryService(IEducationHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<EducationHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<EducationHistoryViewModel>()
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

        public IQueryable<EducationHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<EducationHistoryViewModel>();
        }

        public async Task<IEnumerable<EducationHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var educationHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<EducationHistoryViewModel>()
                .ToListAsync();

            return educationHistory;
        }
    }
}