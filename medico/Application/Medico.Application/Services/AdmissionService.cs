using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Admission;
using Medico.Domain.Constants;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class AdmissionService : BaseDeletableByIdService<Admission, AdmissionVm>, IAdmissionService
    {
        private readonly FullAdmissionInfoVm _expressionTestAdmission =
            new FullAdmissionInfoVm
            {
                PatientId = Guid.Parse(ExpressionTestConstants.Ids.PatientId),
                VitalSigns = new List<VitalSignsViewModel>
                {
                    new VitalSignsViewModel
                    {
                        CreateDate = DateTime.UtcNow,
                        Pulse = 70,
                        SystolicBloodPressure = 120,
                        DiastolicBloodPressure = 80,
                        BloodPressurePosition = "Sitting",
                        BloodPressureLocation = "Right Bicep",
                        OxygenSaturationAtRest = "12",
                        RespirationRate = 10
                    },
                    new VitalSignsViewModel
                    {
                        CreateDate = DateTime.UtcNow.AddHours(1),
                        Pulse = 60,
                        SystolicBloodPressure = 130,
                        DiastolicBloodPressure = 70,
                        BloodPressurePosition = "Sitting",
                        BloodPressureLocation = "Right Bicep",
                        OxygenSaturationAtRest = "12",
                        RespirationRate = 11
                    }
                },
                MedicationPrescriptions = new List<MedicationPrescriptionViewModel>
                {
                }
            };

        public AdmissionService(IAdmissionRepository admissionRepository,
            IMapper mapper) : base(admissionRepository, mapper)
        {
        }

        public async Task<FullAdmissionInfoVm> GetFullAdmissionInfoById(Guid id)
        {
            var isExpressionTestAdmission =
                Guid.Parse(ExpressionTestConstants.Ids.AdmissionId) == id;

            if (isExpressionTestAdmission)
                return _expressionTestAdmission;

            var admission = await Repository.GetAll()
                .Include(a => a.VitalSigns)
                .Include(a => a.MedicationPrescriptions)
                .FirstOrDefaultAsync(a => a.Id == id);

            return admission == null
                ? null
                : Mapper.Map<FullAdmissionInfoVm>(admission);
        }

        public async Task<AdmissionVm> GetByAppointmentId(Guid appointmentId)
        {
            var admission = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            return admission == null
                ? null
                : Mapper.Map<AdmissionVm>(admission);
        }

        public async Task<IEnumerable<AdmissionVm>> GetPreviousPatientAdmissions(Guid patientId, DateTime fromDate)
        {
            var previousAdmissions = await Repository.GetAll()
                .Where(a => a.PatientId == patientId && a.CreatedDate < fromDate)
                .OrderByDescending(a => a.CreatedDate)
                .ProjectTo<AdmissionVm>()
                .ToListAsync();

            return previousAdmissions;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }
    }
}