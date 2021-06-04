using System;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class PatientInsuranceService : BaseService<PatientInsurance, PatientInsuranceViewModel>, IPatientInsuranceService
    {
        public PatientInsuranceService(
            IPatientInsuranceRepository patientInsuranceRepository,
            IMapper mapper) : base(patientInsuranceRepository, mapper)
        {
        }

        public async Task<PatientInsuranceViewModel> GetByPatientId(Guid patientId)
        {
            var patientInsurance = await Repository.GetAll()
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            return patientInsurance == null 
                ? null 
                : Mapper.Map<PatientInsuranceViewModel>(patientInsurance);
        }
    }
}