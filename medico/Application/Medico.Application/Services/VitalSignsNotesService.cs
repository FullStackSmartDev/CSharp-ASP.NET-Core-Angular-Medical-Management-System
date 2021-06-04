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
    public class VitalSignsNotesService : BaseDeletableByIdService<VitalSignsNotes, VitalSignsNotesViewModel>,
        IVitalSignsNotesService
    {
        public VitalSignsNotesService(IVitalSignsNotesRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<VitalSignsNotesViewModel> GetByAdmissionId(Guid admissionId)
        {
            var vitalSignsNotes = await Repository.GetAll()
                .FirstOrDefaultAsync(bvs => bvs.AdmissionId == admissionId);

            return vitalSignsNotes == null
                ? null
                : Mapper.Map<VitalSignsNotesViewModel>(vitalSignsNotes);
        }
    }
}
