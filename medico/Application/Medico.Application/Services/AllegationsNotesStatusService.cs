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
    public class AllegationsNotesStatusService : IAllegationsNotesStatusService
    {
        private readonly IMapper _mapper;
        private readonly IAllegationsNotesStatusRepository _allegationsNotesStatusRepository;

        public AllegationsNotesStatusService(IMapper mapper,
            IAllegationsNotesStatusRepository allegationsNotesStatusRepository)
        {
            _mapper = mapper;
            _allegationsNotesStatusRepository = allegationsNotesStatusRepository;
        }

        public async Task<AllegationsNotesStatusViewModel> Create(AllegationsNotesStatusViewModel allegationsNotesStatusViewModel)
        {
            var allegationsNotesStatus = _mapper.Map<AllegationsNotesStatus>(allegationsNotesStatusViewModel);
            _allegationsNotesStatusRepository.Add(allegationsNotesStatus);
            await _allegationsNotesStatusRepository.SaveChangesAsync();

            allegationsNotesStatusViewModel.Id = allegationsNotesStatus.Id;

            return allegationsNotesStatusViewModel;
        }

        public async Task<AllegationsNotesStatusViewModel> GetByAdmissionId(Guid admissionId)
        {
            var allegationsNotesStatus = await _allegationsNotesStatusRepository.GetAll()
                .FirstOrDefaultAsync(a => a.AdmissionId == admissionId);

            return allegationsNotesStatus == null
                ? null
                : Mapper.Map<AllegationsNotesStatusViewModel>(allegationsNotesStatus);
        }
    }
}
