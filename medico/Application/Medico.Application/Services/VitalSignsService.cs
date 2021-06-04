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
    public class VitalSignsService : BaseDeletableByIdService<VitalSigns, VitalSignsViewModel>,
        IVitalSignsService
    {
        public VitalSignsService(IVitalSignsRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<bool> IsHistoryExist(Guid patientId)
        {
            var tobaccoHistory = await Repository.GetAll()
                .FirstOrDefaultAsync();

            return tobaccoHistory != null;
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<VitalSignsViewModel> GetAll(PatientAdmissionDxOptionsViewModel historyDxOptionsViewModel)
        {
            return Repository.GetAll()
                .Where(th => th.PatientId == historyDxOptionsViewModel.PatientId 
                             && th.AdmissionId == historyDxOptionsViewModel.AdmissionId)
                .ProjectTo<VitalSignsViewModel>();
        }

        public async Task<IEnumerable<VitalSignsViewModel>> GetByPatientAndAdmissionIds(Guid patientId, Guid admissionId)
        {
            var vitalSignsList = await Repository.GetAll()
                .Where(vs => vs.PatientId == patientId && vs.AdmissionId == admissionId)
                .OrderByDescending(vs => vs.CreateDate)
                .ProjectTo<VitalSignsViewModel>()
                .ToListAsync();

            return vitalSignsList;
        }

        public async Task<VitalSignsViewModel> GetLastPatientVitalSigns(Guid patientId, DateTime createDate)
        {
            var vitalSigns = await Repository.GetAll()
                .Where(a => a.PatientId == patientId && a.CreateDate < createDate)
                .OrderByDescending(a => a.CreateDate)
                .FirstOrDefaultAsync();

            return vitalSigns == null
                ? null
                : Mapper.Map<VitalSignsViewModel>(vitalSigns);
        }
    }
}