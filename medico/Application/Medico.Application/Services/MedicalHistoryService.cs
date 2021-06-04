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
    public class MedicalHistoryService : BaseDeletableByIdService<MedicalHistory, MedicalHistoryViewModel>,
        IMedicalHistoryService
    {
        public MedicalHistoryService(IMedicalHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<MedicalHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<MedicalHistoryViewModel>()
                .ToListAsync();

            return tobaccoHistory;
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            return tobaccoHistory != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<MedicalHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<MedicalHistoryViewModel>();
        }

        public async Task<IEnumerable<MedicalHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientMedicalHistory = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<MedicalHistoryViewModel>()
                .ToListAsync();

            return patientMedicalHistory;
        }
    }
}