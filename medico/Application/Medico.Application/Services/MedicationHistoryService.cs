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
    public class MedicationHistoryService : BaseDeletableByIdService<MedicationHistory, MedicationHistoryViewModel>,
        IMedicationHistoryService
    {
        public MedicationHistoryService(IMedicationHistoryRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<MedicationHistoryViewModel>> GetByPatientId(Guid patientId)
        {
            var medicationHistory = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<MedicationHistoryViewModel>()
                .ToListAsync();

            return medicationHistory;
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var medicationHistory = await Repository.GetAll()
                .FirstOrDefaultAsync(h => h.PatientId == patientId);

            return medicationHistory != null;
        }

        public Task<MedicationHistoryViewModel> Create(MedicationPrescriptionViewModel medicationPrescriptionViewModel)
        {
            var medicationHistoryViewModel = Mapper.Map<MedicationHistoryViewModel>(medicationPrescriptionViewModel);
            return Create(medicationHistoryViewModel);
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<MedicationHistoryViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<MedicationHistoryViewModel>();
        }

        public async Task<IEnumerable<MedicationHistoryViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientMedications = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<MedicationHistoryViewModel>()
                .ToListAsync();

            return patientMedications;
        }
    }
}