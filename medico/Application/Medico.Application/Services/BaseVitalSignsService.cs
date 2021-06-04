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
    public class BaseVitalSignsService : IBaseVitalSignsService
    {
        private readonly IBaseVitalSignsRepository _repository;
        private readonly IMapper _mapper;

        public BaseVitalSignsService(IBaseVitalSignsRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<BaseVitalSignsViewModel> GetByPatientId(Guid patientId)
        {
            var baseVitalSigns = await _repository.GetAll()
                .FirstOrDefaultAsync(bvs => bvs.PatientId == patientId);
            return baseVitalSigns == null
                ? null
                : _mapper.Map<BaseVitalSignsViewModel>(baseVitalSigns);
        }

        public async Task<BaseVitalSignsViewModel> Create(BaseVitalSignsViewModel baseVitalSignsViewModel)
        {
            var baseVitalSigns = Mapper.Map<BaseVitalSigns>(baseVitalSignsViewModel);
            _repository.Add(baseVitalSigns);
            await _repository.SaveChangesAsync();

            baseVitalSignsViewModel.Id = baseVitalSigns.Id;

            return baseVitalSignsViewModel;
        }

        public async Task<BaseVitalSignsViewModel> Update(BaseVitalSignsViewModel baseVitalSignsViewModel)
        {
            var baseVitalSigns = Mapper.Map<BaseVitalSigns>(baseVitalSignsViewModel);
            _repository.Update(baseVitalSigns);
            await _repository.SaveChangesAsync();

            baseVitalSignsViewModel.Id = baseVitalSigns.Id;

            return baseVitalSignsViewModel;
        }
    }
}