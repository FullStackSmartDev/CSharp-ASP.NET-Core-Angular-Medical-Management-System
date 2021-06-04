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
    public class AllergyService : BaseDeletableByIdService<Allergy, AllergyViewModel>,
        IAllergyService
    {
        private readonly IMedicationClassMedicationNameRepository _medicationClassMedicationNameRepository;

        public AllergyService(IAllergyRepository repository,
            IMapper mapper,
            IMedicationClassMedicationNameRepository medicationClassMedicationNameRepository)
            : base(repository, mapper)
        {
            _medicationClassMedicationNameRepository = medicationClassMedicationNameRepository;
        }

        public async Task<IEnumerable<AllergyViewModel>> GetByPatientId(Guid patientId)
        {
            var allergy = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<AllergyViewModel>()
                .ToListAsync();

            return allergy;
        }

        public async Task<bool> IsAllergyExist(Guid patientId)
        {
            var allergy = await Repository.GetAll()
                .FirstOrDefaultAsync(h => h.PatientId == patientId);

            return allergy != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<AllergyViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<AllergyViewModel>();
        }

        public async Task<IEnumerable<AllergyViewModel>> GetByPatientIdAndDate(Guid patientId, DateTime date)
        {
            var allergies = await Repository.GetAll()
                .Where(a => a.PatientId == patientId && a.CreateDate < date)
                .OrderByDescending(a => a.CreateDate)
                .ProjectTo<AllergyViewModel>()
                .ToListAsync();

            return allergies;
        }

        public async Task<IEnumerable<AllergyViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientAllergies = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<AllergyViewModel>()
                .ToListAsync();

            return patientAllergies;
        }

        public async Task<AllergyOnMedicationViewModel> GetPatientAllergyOnMedication(Guid patientId, Guid medicationNameId)
        {
            var medicationAllergy = await Repository.GetAll()
                .Include(a => a.MedicationName)
                .FirstOrDefaultAsync(a => a.PatientId == patientId && a.MedicationNameId == medicationNameId);
            if (medicationAllergy != null)
                return Mapper.Map<AllergyOnMedicationViewModel>(medicationAllergy);

            var medicationClassAllergy = await Repository.GetAll()
                .Where(a => a.PatientId == patientId && a.MedicationClassId != null)
                .Include(a => a.MedicationClass.MedicationNames)
                .FirstOrDefaultAsync(a =>
                    a.MedicationClass.MedicationNames.Select(mn => mn.MedicationNameId).Contains(medicationNameId));

            return medicationClassAllergy == null 
                ? null 
                : Mapper.Map<AllergyOnMedicationViewModel>(medicationClassAllergy);
        }
    }
}