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
    public class MedicationPrescriptionService
        : BaseDeletableByIdService<MedicationPrescription, MedicationPrescriptionViewModel>,
            IMedicationPrescriptionService
    {
        public MedicationPrescriptionService(IMedicationPrescriptionRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<bool> IsPrescriptionExist(Guid admissionId)
        {
            var prescription = await Repository.GetAll()
                .FirstOrDefaultAsync(p => p.AdmissionId == admissionId);

            return prescription != null;
        }

        public IQueryable<MedicationPrescriptionViewModel> GetAll(PatientAdmissionDxOptionsViewModel patientAdmissionDxOptions)
        {
            var admissionId = patientAdmissionDxOptions.AdmissionId;
            return Repository.GetAll()
                .Where(p => p.AdmissionId == admissionId)
                .ProjectTo<MedicationPrescriptionViewModel>();
        }

        public async Task<IEnumerable<MedicationPrescriptionViewModel>> GetByAdmissionId(Guid admissionId)
        {
            var prescriptions = await Repository.GetAll().Where(mp => mp.AdmissionId == admissionId)
                .ProjectTo<MedicationPrescriptionViewModel>()
                .ToListAsync();

            return prescriptions;
        }
    }
}
