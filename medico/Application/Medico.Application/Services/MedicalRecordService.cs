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
    public class MedicalRecordService : BaseDeletableByIdService<MedicalRecord, MedicalRecordViewModel>,
        IMedicalRecordService
    {
        public MedicalRecordService(IMedicalRecordRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<IEnumerable<MedicalRecordViewModel>> GetByPatientId(Guid patientId)
        {
            var medicalRecord = await Repository.GetAll()
                .Where(h => h.PatientId == patientId)
                .ProjectTo<MedicalRecordViewModel>()
                .ToListAsync();

            return medicalRecord;
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var medicalRecord = await Repository.GetAll()
                .FirstOrDefaultAsync(h => h.PatientId == patientId);

            return medicalRecord != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<MedicalRecordViewModel> GetAll(HistoryDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId)
                .ProjectTo<MedicalRecordViewModel>();
        }

        public async Task<IEnumerable<MedicalRecordViewModel>> GetAllByPatientId(Guid patientId)
        {
            var patientMedicalRecords = await Repository.GetAll()
                .Where(th => th.PatientId == patientId)
                .ProjectTo<MedicalRecordViewModel>()
                .ToListAsync();

            return patientMedicalRecords;
        }
    }
}